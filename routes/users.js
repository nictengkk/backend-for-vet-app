const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const { Coordinate, Clinic, User, Review } = require("../models");
const jwt = require("jsonwebtoken");

const secret = "Avengers unite";

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ error: { message: "Please login" } });
    }
    const userData = await jwt.verify(token, secret);
    if (userData) {
      req.userData = userData;
      return next();
    }
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

router.route("/").get(async (req, res) => {
  try {
    const Op = Sequelize.Op;
    const { email, username, name } = req.query;

    if (email || username || name) {
      const user = await User.findAll({
        where: {
          [Op.or]: [
            {
              email: { [Op.substring]: email }
            },
            {
              username: { [Op.substring]: username }
            },
            {
              name: { [Op.substring]: name }
            }
          ]
        },
        attributes: { exclude: ["password"] }, //match based on substring username or email or name
        include: [
          {
            model: Review,
            as: "reviews"
          }
        ]
      });
      res.json(user);
    } else {
      const users = await User.findAll({
        include: [
          {
            model: Review,
            as: "reviews"
          }
        ],
        attributes: { exclude: ["password"] }
      });
      res.json(users);
    }
  } catch (error) {
    return res.sendStatus(400);
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await User.findAll({
        where: { id: id },
        include: [
          {
            model: Review,
            as: "reviews"
          }
        ],
        attributes: { exclude: ["password"] }
      });
      res.json(user);
    } else {
      const users = await User.findAll();
      res.json(users);
    }
  } catch (error) {
    return res.sendStatus(400);
  }
});

module.exports = router;
