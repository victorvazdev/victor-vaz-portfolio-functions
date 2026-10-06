const express = require("express");
const cors = require("cors");
const contact = require("./routes/contact");

const app = express();
app.use(cors({origin: true}));
app.use(contact);

module.exports = app;
