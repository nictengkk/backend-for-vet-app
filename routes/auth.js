const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const secret = "Avengers unite";
const isDev = process.env.NODE_ENV !== "production";

const cookieOptions = {
  httpOnly: true,
  secure: !isDev
};

router.route("/signup").post(async (req, res) => {
  try {
    const user = await User.create(req.body);
    //create a page view that says your account has been successfully created
    const { id } = user;
    // const userData = { id };
    // const expiresIn24hour = { expiresIn: "24h" };
    // const token = await jwt.sign(userData, secret, expiresIn24hour);
    // res.cookie("sessionCookie", token, cookieOptions);
    return res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName ? user.lastName : "",
      username: user.username
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ error: { message: "User does not exist" } });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Your password is invalid, please try again.");
    }
    const { id, dataValues } = user;
    //creating payload
    const userData = { id, dataValues };
    const expiresIn24hour = { expiresIn: "24h" };
    const token = await jwt.sign(userData, secret, expiresIn24hour);
    res.cookie("sessionCookie", token, cookieOptions);
    return res.status(201).json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName ? user.lastName : "",
      username: user.username,
      isAdmin: user.dataValues.isAdmin
    });
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
