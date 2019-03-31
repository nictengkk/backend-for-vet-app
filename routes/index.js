const express = require("express");
const { User } = require("../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const secret = "Avengers unite";

const cookieOptions = {
  httpOnly: true
};

router.route("/register").post(async (req, res) => {
  try {
    const user = await User.create(req.body);
    //create a page view that says your account has been successfully created
    return res.status(201).json(user);
    // .redirect("/");
    //how to link back to "/"
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error.message });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("Please register for an account!");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Your password is invalid, please try again.");
    }
    const { id } = user;
    //creating payload
    const userData = { id };
    const expiresIn24hour = { expiresIn: "24h" };
    const token = await jwt.sign(userData, secret, expiresIn24hour);

    return res.cookie("sessionCookie", token, cookieOptions).end();
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

router.route("/logout").post((req, res) => {
  res.clearCookie("sessionCookie", cookieOptions);
  res.status(200).json({ message: "You are successfully logged out" });
});

router.route("/").get((req, res) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
