const {test, before, after, beforeEach} = require("node:test");
const assert = require("node:assert/strict");
const {mockModule, startServer, postJson} = require("../helpers");

const calls = [];
let failWith = null;

mockModule("../src/services/mailer", {
  sendContactEmail: async (contact) => {
    calls.push(contact);
    if (failWith) throw new Error(failWith);
  },
});

const app = require("../../src/app");
const valid = {name: "Maria", email: "maria@example.com", message: "Olá!"};
let server;

before(async () => {
  server = await startServer(app);
});
after(() => server.close());
beforeEach(() => {
  calls.length = 0;
  failWith = null;
});

test("POST /send-email envia e responde 200", async () => {
  const res = await postJson(`${server.url}/send-email`, valid);

  assert.equal(res.status, 200);
  assert.deepEqual(res.body,
      {sucess: true, message: "Email sent succesfully"});
  assert.deepEqual(calls, [valid]);
});

for (const field of ["name", "email", "message"]) {
  test(`POST /send-email sem ${field} responde 400`, async () => {
    const body = Object.assign({}, valid, {[field]: ""});
    const res = await postJson(`${server.url}/send-email`, body);

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, {error: "Missing required fields"});
    assert.equal(calls.length, 0);
  });
}

test("POST /send-email responde 500 quando o envio falha", async () => {
  failWith = "Invalid API key";
  const res = await postJson(`${server.url}/send-email`, valid);

  assert.equal(res.status, 500);
  assert.deepEqual(res.body, {error: "Email failed: Invalid API key"});
});

test("libera CORS para o site", async () => {
  const res = await postJson(`${server.url}/send-email`, valid,
      {origin: "https://victorvaz.dev"});

  assert.equal(res.headers.get("access-control-allow-origin"),
      "https://victorvaz.dev");
});

test("GET /portfolio não existe mais", async () => {
  const res = await fetch(`${server.url}/portfolio`);

  assert.equal(res.status, 404);
});
