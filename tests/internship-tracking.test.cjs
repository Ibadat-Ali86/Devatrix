const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync("src/app/api/internships/apply/route.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

async function submitWithDatabaseErrors(errors) {
  const inserts = [];
  let digit = 0;
  const accountId = "00000000-0000-4000-8000-000000000001";
  const mocks = {
    "@supabase/supabase-js": {
      createClient: () => ({
        from: () => ({ insert: () => ({ select: () => ({ single: async () => ({ data: { user_id: accountId }, error: null }) }) }) }),
        auth: { admin: {
          getUserById: async () => ({ data: { user: null }, error: { status: 404 } }),
          createUser: async (user) => ({ data: { user: { id: user.id, email: user.email, app_metadata: user.app_metadata } }, error: null }),
        } },
        rpc: async (_name, args) => {
          inserts.push(args.p_application);
          const error = errors[inserts.length - 1] || null;
          return { data: error ? null : "created", error };
        },
      }),
    },
    "next/server": { NextResponse: { json: (body, init) => ({ body, status: init?.status || 200 }) } },
    crypto: {
      randomUUID: () => "synthetic-id",
      randomBytes: (size) => Buffer.alloc(size, 1),
      randomInt: () => {
        const i = digit++;
        return i % 2 === 0 ? Math.floor(i / 2) % 26 : 26 + Math.floor(i / 2) % 10;
      },
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports,
    require: (name) => mocks[name] || require(name),
    process: { env: { SUPABASE_URL: "https://example.invalid", SUPABASE_SECRET_KEY: "test-only" } },
    console: { error: () => {} }, URL,
  });
  const request = {
    headers: { get: (name) => name === "content-type" ? "application/json" : null },
    json: async () => ({ fullName: "Test", email: "test@example.invalid", whatsapp: "0", university: "Test", track: "Test", statement: "Test" }),
  };
  return { response: await module.exports.POST(request), inserts };
}

const collision = { code: "23505", details: "Key (tracking_code) already exists." };

test("retries a reference collision without revealing the reference", async () => {
  const { response, inserts } = await submitWithDatabaseErrors([collision, null]);
  assert.equal(response.status, 201);
  assert.equal(inserts.length, 2);
  assert.match(inserts[0].tracking_code, /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{6}$/);
  assert.notEqual(inserts[0].tracking_code, inserts[1].tracking_code);
  assert.equal(response.body.tracking_code, undefined);
  assert.equal(response.body.id, undefined);
  assert.equal(response.body.candidateId, undefined);
});

test("does not retry a different unique-constraint failure", async () => {
  const { response, inserts } = await submitWithDatabaseErrors([{ code: "23505", details: "Key (id) already exists." }]);
  assert.equal(response.status, 503);
  assert.equal(inserts.length, 1);
});

test("stops after five reference collisions", async () => {
  const { response, inserts } = await submitWithDatabaseErrors(Array(5).fill(collision));
  assert.equal(response.status, 503);
  assert.equal(inserts.length, 5);
});
