// Run against the development project only. This creates and removes synthetic users;
// admin.createUser with email_confirm does not send invitations or confirmation email.
import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";

const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: secret, SUPABASE_PUBLISHABLE_KEY: publishable } = process.env;
if (process.env.DEVATRIX_PORTAL_TEST !== "1") throw new Error("Set DEVATRIX_PORTAL_TEST=1 only after verifying the target is a development project.");
if (!url || !secret || !publishable) throw new Error("Development Supabase URL, secret, and publishable key are required.");
const root = process.env.PORTAL_TEST_URL || "http://127.0.0.1:3101";
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const users = [], applications = [];
const suffix = randomUUID(), password = randomBytes(24).toString("base64url");

try {
  for (let i = 0; i < 3; i++) {
    const email = `portal-test-${i}-${suffix}@example.invalid`;
    const result = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (result.error || !result.data.user) throw new Error("Could not create a synthetic auth user.");
    users.push({ id: result.data.user.id, email });
  }
  for (let i = 0; i < 2; i++) {
    const id = randomUUID();
    const result = await admin.from("internship_applications").insert({ id, full_name: `Portal Test ${i}`, email: users[i].email, whatsapp: "0", university: "Test", track: `Test track ${i}`, duration: "Test", statement: "Synthetic test" });
    if (result.error) throw new Error("Could not create a synthetic application.");
    applications.push(id);
    const access = await admin.from("intern_portal_access").insert({ user_id: users[i].id, application_id: id, is_active: true });
    if (access.error) throw new Error("Could not create synthetic portal access.");
  }
  const secondApplicationId = randomUUID();
  const secondApplication = await admin.from("internship_applications").insert({ id: secondApplicationId, full_name: "Portal Test 0", email: users[0].email, whatsapp: "0", university: "Test", track: "Second test track", duration: "Test", statement: "Synthetic test" });
  if (secondApplication.error) throw new Error("Could not create a second application.");
  applications.push(secondApplicationId);
  const secondAccess = await admin.from("intern_portal_access").insert({ user_id: users[0].id, application_id: secondApplicationId, is_active: true });
  if (secondAccess.error) throw new Error("Could not link a second application.");

  const anonymous = createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } });
  const anonResult = await anonymous.from("internship_applications").select("id,full_name,track,status");
  if (!anonResult.error && anonResult.data?.length) throw new Error("Anonymous user could read applications.");
  for (let i = 0; i < 2; i++) {
    const client = createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } });
    const signed = await client.auth.signInWithPassword({ email: users[i].email, password });
    if (signed.error) throw new Error("Synthetic user sign-in failed.");
    const own = await client.from("internship_applications").select("id,full_name,track,status");
    const expected = i === 0 ? [applications[0], secondApplicationId] : [applications[1]];
    if (own.error || own.data?.length !== expected.length || own.data.some((item) => !expected.includes(item.id))) throw new Error("User isolation check failed.");
    const privateFields = await client.from("internship_applications").select("email");
    if (!privateFields.error) throw new Error("Sensitive application column was accessible.");
    const unauthorizedUpdate = await client.from("intern_portal_access").update({ is_active: true }).eq("user_id", users[i].id);
    if (!unauthorizedUpdate.error) throw new Error("Intern could change portal access.");
  }

  const send = (email, origin) => fetch(`${root}/api/portal/session`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ email, password }) });
  if ((await send(users[0].email, "https://example.invalid")).status !== 403) throw new Error("Cross-origin sign-in was not rejected.");
  const noAccess = await send(users[2].email, root);
  if (noAccess.status !== 401) throw new Error(`Unapproved account sign-in was not rejected (HTTP ${noAccess.status}).`);
  const login = await send(users[0].email, root);
  if (login.status !== 200) throw new Error(`Approved portal sign-in failed (HTTP ${login.status}).`);
  const cookie = login.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
  if (!cookie) throw new Error("Sign-in cookie was not set.");
  const page = await fetch(`${root}/portal`, { headers: { Cookie: cookie } });
  const html = await page.text();
  if (!html.includes("Portal Test 0") || html.includes("Portal Test 1")) throw new Error("Portal content was not correctly isolated.");
  const crossOriginSignout = await fetch(`${root}/api/portal/session`, { method: "DELETE", headers: { Cookie: cookie, Origin: "https://example.invalid" } });
  if (crossOriginSignout.status !== 403) throw new Error("Cross-origin sign-out was not rejected.");
  const deactivated = await admin.from("intern_portal_access").update({ is_active: false }).eq("user_id", users[0].id);
  if (deactivated.error) throw new Error("Could not test revocation.");
  const after = await fetch(`${root}/portal`, { headers: { Cookie: cookie }, redirect: "manual" });
  const afterHtml = await after.text();
  if (afterHtml.includes("Portal Test 0") || (!afterHtml.includes("/portal/sign-in") && after.status !== 307)) throw new Error("Deactivated portal access was not revoked.");
  const signout = await fetch(`${root}/api/portal/session`, { method: "DELETE", headers: { Cookie: cookie, Origin: root } });
  if (signout.status !== 200 || !signout.headers.getSetCookie().length) throw new Error("Sign-out did not clear the session.");
  console.log("Passed: sign-in, sign-out, unapproved denial, CSRF rejection, user isolation, sensitive-column protection and revocation.");
} finally {
  let cleanupFailed = false;
  for (const user of users) {
    const result = await admin.auth.admin.deleteUser(user.id);
    if (result.error) cleanupFailed = true;
  }
  if (applications.length) {
    const result = await admin.from("internship_applications").delete().in("id", applications);
    if (result.error) cleanupFailed = true;
  }
  console.log(cleanupFailed ? "Synthetic test cleanup failed; manual review required." : "Synthetic auth users and applications removed.");
  if (cleanupFailed) process.exitCode = 1;
}
