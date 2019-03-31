const express = require("express");
const cors = require("cors");
const app = express();

const clinics = require("./routes/clinics");
const index = require("./routes/index");
const users = require("./routes/users");
const cookieParser = require("cookie-parser");

const isDev = process.env.NODE_ENV !== "production";

const whitelist = [
  "https://findynearestvet.netlify.com",
  "https://backend-for-vet-app.herokuapp.com/"
];

if (isDev) {
  whitelist.push("http://localhost:3000");
}

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/", index);
app.use("/api/clinics", clinics);
app.use("/api/users", users);

module.exports = app;
