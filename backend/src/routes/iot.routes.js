// src/routes/iot.routes.js
const express = require("express");
const router = express.Router();
const { recibirEvento } = require("../controllers/iot.controller");

router.post("/evento", recibirEvento);

module.exports = router;