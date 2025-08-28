const express = require("express");
const router = express.Router();
const { sendContactMail } = require("../utils/contectMail");

// POST /api/contact
router.post("/", sendContactMail);

module.exports = router;
