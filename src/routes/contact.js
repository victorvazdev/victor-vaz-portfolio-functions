const express = require("express");
const {sendContactEmail} = require("../services/mailer");

const router = new express.Router();

router.post("/send-email", async (req, res) => {
  const {name, email, message} = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({error: "Missing required fields"});
  }

  try {
    await sendContactEmail({name, email, message});
    return res.json({sucess: true, message: "Email sent succesfully"});
  } catch (error) {
    return res.status(500).json({error: "Email failed: " + error.message});
  }
});

module.exports = router;
