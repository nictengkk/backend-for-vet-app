const express = require("express");
const { Customer } = require("../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const secret = "Avengers unite";

router.route("/register").post(async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    //create a page view that says your account has been successfully created
    return res.status(201).json(customer);
    // .redirect("/");
    //how to link back to "/"
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error.message });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      throw new Error("Please register for an account!");
    }

    const match = await bcrypt.compare(password, customer.password);

    if (!match) {
      throw new Error("Your password is invalid, please try again.");
    }
    const { id } = customer;
    //creating payload
    const userData = { id };
    const expiresIn24hour = { expiresIn: "24h" };
    const token = await jwt.sign(userData, secret, expiresIn24hour);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).send(error.message);
  }
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
