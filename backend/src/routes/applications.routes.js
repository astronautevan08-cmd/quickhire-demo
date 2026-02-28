const express = require("express");
const { createApplication } = require("../controllers/applications.controller");

const router = express.Router();

router.post("/", createApplication);

module.exports = router;