// src/app.js
const express = require("express");
const cors = require("cors");

const iotRoutes = require("./routes/iot.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/iot", iotRoutes);

module.exports = app;