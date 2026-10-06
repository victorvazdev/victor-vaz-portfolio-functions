const {test, beforeEach} = require("node:test");
const assert = require("node:assert/strict");
const {mockModule} = require("../helpers");

const sent = [];
let nextResult;

mockModule("resend", {
  Resend: class {
    /** @param {string} apiKey API key recebida. */
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.emails = {
        send: async (payload) => {
          sent.push(payload);
          return nextResult;
        },
      };
    }
  },
});
mockModule("../src/config", {
  email: {
    resendApiKey: "re_test",
    from: "Portfólio <contato@updates.victorvaz.dev>",
    to: "victor@victorvaz.dev",
  },
});

const {sendContactEmail} = require("../../src/services/mailer");

beforeEach(() => {
  sent.length = 0;
  nextResult = {data: {id: "email_123"}, error: null};
});

test("envia com remetente, destinatário e replyTo corretos", async () => {
  await sendContactEmail({
    name: "Maria",
    email: "maria@example.com",
    message: "Olá!",
  });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].from, "Portfólio <contato@updates.victorvaz.dev>");
  assert.equal(sent[0].to, "victor@victorvaz.dev");
  assert.equal(sent[0].replyTo, "maria@example.com");
  assert.equal(sent[0].text, "Olá!");
  assert.match(sent[0].html, /Maria \(maria@example\.com\)/);
});

test("escapa HTML vindo do formulário", async () => {
  await sendContactEmail({
    name: "<b>Eve</b>",
    email: "eve@example.com",
    message: "<script>alert('x')</script> & \"aspas\"",
  });

  const {html} = sent[0];
  assert.doesNotMatch(html, /<script>|<b>/);
  assert.match(html, /&lt;b&gt;Eve&lt;\/b&gt;/);
  assert.match(html, /&lt;script&gt;alert\(&#39;x&#39;\)&lt;\/script&gt;/);
  assert.match(html, /&amp; &quot;aspas&quot;/);
});

test("lança erro quando o Resend devolve erro", async () => {
  nextResult = {data: null, error: {message: "Invalid API key"}};

  await assert.rejects(
      sendContactEmail({name: "a", email: "a@example.com", message: "m"}),
      {message: "Invalid API key"},
  );
});
