// Creates and removes synthetic records. Never run against a production project.
import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";

if (process.env.DEVATRIX_PROVISIONING_TEST !== "1") throw new Error("Verify the development target, then set DEVATRIX_PROVISIONING_TEST=1.");
const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: secret, SUPABASE_PUBLISHABLE_KEY: publishable } = process.env;
if (!url || !secret || !publishable) throw new Error("Development Supabase URL, secret, and publishable key are required.");
const root = process.env.PORTAL_TEST_URL || "http://127.0.0.1:3101";
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secret, options);
const email = `provision-test-${randomUUID()}@example.invalid`;
const existingEmail = `existing-test-${randomUUID()}@example.invalid`;
const recoveryEmail = `recovery-test-${randomUUID()}@example.invalid`;
const ids = [randomUUID(), randomUUID()];
let accountId;
let existingUserId;
let recoveryUserId;
let recoveryApplicationId;

try {
  const submit = async (id, targetEmail = email) => {
    const response = await fetch(`${root}/api/internships/apply`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: id, fullName: "Synthetic Applicant", email: targetEmail, whatsapp: "0000", university: "Test", track: "Test", statement: "Test submission" }),
    });
    const body = await response.json();
    if (response.status !== 201 || !body.success) throw new Error(`Application submission failed (HTTP ${response.status}).`);
    if (/tracking|password|candidateId|userId/i.test(JSON.stringify(body))) throw new Error("Private credentials or reference were returned to the browser.");
  };

  await Promise.all(ids.map((id) => submit(id)));
  const account = await admin.from("intern_accounts").select("user_id").eq("email", email).single();
  if (account.error || !account.data) throw new Error("Applicant account reservation is missing.");
  accountId = account.data.user_id;
  const links = await admin.from("intern_portal_access").select("application_id,is_active").eq("user_id", accountId);
  if (links.error || links.data.length !== 2 || links.data.some((link) => link.is_active) || ids.some((id) => !links.data.some((link) => link.application_id === id))) throw new Error("Applications were not linked as inactive to one account.");
  const apps = await admin.from("internship_applications").select("id,tracking_code,status").in("id", ids);
  if (apps.error || apps.data.length !== 2 || new Set(apps.data.map((item) => item.tracking_code)).size !== 2 || apps.data.some((item) => !/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{6}$/.test(item.tracking_code) || item.status !== "under_review")) throw new Error("Application references or statuses are invalid.");
  const auth = await admin.auth.admin.getUserById(accountId);
  if (auth.error || auth.data.user.email_confirmed_at || auth.data.user.confirmation_sent_at || auth.data.user.app_metadata.devatrix_applicant_id !== accountId) throw new Error("Auth account was not provisioned securely or an email was unexpectedly sent.");
  await submit(ids[0]);
  const after = await admin.from("internship_applications").select("id").eq("email", email);
  if (after.error || after.data.length !== 2) throw new Error("Retry created a duplicate application.");
  const changedRetry = await fetch(`${root}/api/internships/apply`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId: ids[0], fullName: "Synthetic Applicant", email, whatsapp: "0000", university: "Test", track: "Test", statement: "A changed submission" }),
  });
  if (changedRetry.status !== 409) throw new Error("A changed retry was not rejected.");

  const chosenPassword = randomBytes(32).toString("base64url");
  const activated = await admin.auth.admin.updateUserById(accountId, { email_confirm: true, password: chosenPassword });
  if (activated.error) throw new Error("Could not prepare a previously activated account.");
  const thirdId = randomUUID();
  ids.push(thirdId);
  await submit(thirdId);
  const authClient = createClient(url, publishable, options);
  const priorPassword = await authClient.auth.signInWithPassword({ email, password: chosenPassword });
  const existingLinks = await admin.from("intern_portal_access").select("application_id,is_active").eq("user_id", accountId);
  if (priorPassword.error || existingLinks.error || existingLinks.data.length !== 3 || existingLinks.data.some((link) => link.is_active)) throw new Error("An existing account was changed or an application was incorrectly activated.");
  const prematureLogin = await fetch(`${root}/api/portal/session`, { method: "POST", headers: { "Content-Type": "application/json", Origin: root }, body: JSON.stringify({ email, password: chosenPassword }) });
  if (prematureLogin.status !== 401) throw new Error("An account without active portal access was admitted.");

  const anonymous = createClient(url, publishable, options);
  const privateAccount = await anonymous.from("intern_accounts").select("user_id");
  if (!privateAccount.error && privateAccount.data?.length) throw new Error("Applicant account reservations are publicly readable.");
  const forbiddenRpc = await anonymous.rpc("register_internship_application", { p_user_id: accountId, p_application: {} });
  if (!forbiddenRpc.error) throw new Error("Applicant provisioning RPC is publicly callable.");

  recoveryUserId = randomUUID();
  recoveryApplicationId = randomUUID();
  const pendingReservation = await admin.from("intern_accounts").insert({ user_id: recoveryUserId, email: recoveryEmail });
  if (pendingReservation.error) throw new Error("Could not prepare an incomplete reservation.");
  await submit(recoveryApplicationId, recoveryEmail);
  const recovered = await admin.auth.admin.getUserById(recoveryUserId);
  if (recovered.error || recovered.data.user.id !== recoveryUserId || recovered.data.user.email_confirmed_at) throw new Error("An incomplete reservation was not recovered safely.");

  const unrelated = await admin.auth.admin.createUser({ email: existingEmail, password: randomBytes(32).toString("base64url"), email_confirm: true });
  if (unrelated.error || !unrelated.data.user) throw new Error("Could not prepare an unrelated Auth account.");
  existingUserId = unrelated.data.user.id;
  const conflictingId = randomUUID();
  const conflict = await fetch(`${root}/api/internships/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionId: conflictingId, fullName: "Synthetic Applicant", email: existingEmail, whatsapp: "0000", university: "Test", track: "Test", statement: "Test submission" }) });
  if (conflict.status !== 503) throw new Error("An unrelated existing Auth account was not rejected.");
  const unchanged = await admin.auth.admin.getUserById(existingUserId);
  const unexpected = await admin.from("internship_applications").select("id").eq("id", conflictingId);
  if (unchanged.error || unchanged.data.user.email !== existingEmail || unexpected.error || unexpected.data.length) throw new Error("Existing Auth account was altered or incorrectly linked.");
  console.log("Passed: concurrent applications, account recovery and reuse, inactive portal access, private references, idempotent retry and unrelated-account protection.");
} finally {
  const account = await admin.from("intern_accounts").select("user_id").eq("email", email).maybeSingle();
  accountId ||= account.data?.user_id;
  let failed = !!account.error;
  if (accountId) {
    const result = await admin.auth.admin.deleteUser(accountId);
    if (result.error && result.error.status !== 404) failed = true;
  }
  if (existingUserId) {
    const result = await admin.auth.admin.deleteUser(existingUserId);
    if (result.error && result.error.status !== 404) failed = true;
  }
  if (recoveryUserId) {
    const result = await admin.auth.admin.deleteUser(recoveryUserId);
    if (result.error && result.error.status !== 404) failed = true;
  }
  const applications = await admin.from("internship_applications").delete().in("id", ids);
  if (applications.error) failed = true;
  if (recoveryApplicationId) {
    const result = await admin.from("internship_applications").delete().eq("id", recoveryApplicationId);
    if (result.error) failed = true;
  }
  const reservation = await admin.from("intern_accounts").delete().eq("email", email);
  if (reservation.error) failed = true;
  const existingReservation = await admin.from("intern_accounts").delete().eq("email", existingEmail);
  if (existingReservation.error) failed = true;
  const recoveryReservation = await admin.from("intern_accounts").delete().eq("email", recoveryEmail);
  if (recoveryReservation.error) failed = true;
  console.log(failed ? "Synthetic provisioning cleanup failed; manual review required." : "Synthetic account and applications removed.");
  if (failed) process.exitCode = 1;
}
