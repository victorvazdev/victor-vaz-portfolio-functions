const {Resend} = require("resend");
const {email: config} = require("../config");

const resend = new Resend(config.resendApiKey);

/**
 * Escapa caracteres especiais para inserir texto com segurança em HTML.
 * @param {string} text Texto vindo do formulário.
 * @return {string} Texto escapado.
 */
function escapeHtml(text) {
  return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}

/**
 * Envia a mensagem do formulário de contato via Resend.
 * @param {{name: string, email: string, message: string}} contact Formulário.
 * @return {Promise<void>}
 */
async function sendContactEmail({name, email, message}) {
  const {error} = await resend.emails.send({
    from: config.from,
    to: config.to,
    replyTo: email,
    subject: "New Contact Message",
    text: message,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} ` +
      `(${escapeHtml(email)})</p><p>${escapeHtml(message)}</p>`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

module.exports = {sendContactEmail};
