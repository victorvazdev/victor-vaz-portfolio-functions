require("dotenv").config();

module.exports = {
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  },
};
