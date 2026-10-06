const {test} = require("node:test");
const assert = require("node:assert/strict");
const {startServer, postJson} = require("../helpers");
const {email: config} = require("../../src/config");

const missing = ["resendApiKey", "from", "to"].filter((key) => !config[key]);

test("envia um e-mail real pelo Resend", {
  skip: missing.length > 0 ? `faltando no .env: ${missing.join(", ")}` : false,
}, async () => {
  const server = await startServer(require("../../src/app"));

  try {
    const res = await postJson(`${server.url}/send-email`, {
      name: "Teste automatizado",
      email: config.to,
      message: `Teste de integração em ${new Date().toISOString()}`,
    });

    assert.deepEqual(res.body,
        {sucess: true, message: "Email sent succesfully"});
    assert.equal(res.status, 200);
  } finally {
    await server.close();
  }
});
