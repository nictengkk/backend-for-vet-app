const express = require("express");
// const cors = require("cors");
const app = express();

const clinics = require("./routes/clinics");
const index = require("./routes/index");

// middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", index);
app.use("/api/clinics", clinics);

module.exports = app;
