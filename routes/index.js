const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.route("/register").get((req, res) => {
  res.sendStatus(200);
});

router.route("/register").post(async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    //check that existing user dont exist
    //create a page view that says your account has been successfully created
    return res.status(204).redirect("/");
    //how to link back to "/"
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
