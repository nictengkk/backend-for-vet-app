const express = require("express");
const { Customer } = require("../models/");
const bcrypt = require("bcrypt");
const router = express.Router();

router.route("/register").get((req, res) => {
  res.sendStatus(200);
});

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
    return res.status(200).json({ success: "You are successfully logged in" });
    // const {id} = customer
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
