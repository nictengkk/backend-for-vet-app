const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const { Coordinate, Clinic, User, Review } = require("../models");
const jwt = require("jsonwebtoken");

const secret = "Avengers unite";
const verifyAdmin = async (req, res, next) => {
  try {
    const { userData } = req;
    if (userData) {
      const user = await User.findOne({
        where: { id: userData.id }
      });
      if (user.isAdmin) {
        return next();
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { sessionCookie } = req.cookies;
    if (!sessionCookie) {
      return res.status(403).json({ error: { message: "Please login" } });
    }
    const userData = await jwt.verify(sessionCookie, secret);
    if (userData) {
      req.userData = userData;
      return next();
    }
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

router
  .route("/")
  .get(async (req, res) => {
    try {
      const Op = Sequelize.Op;
      const { name, address } = req.query;

      //ensure all queries are met regardless of upper lower case
      if (name || address) {
        const clinics = await Clinic.findAll({
          where: {
            [Op.or]: [
              {
                address: { [Op.substring]: address }
              },
              {
                name: { [Op.substring]: name }
              }
            ]
          }, //match based on substring name and address
          include: [
            {
              model: Review,
              include: [{ model: User, attributes: { exclude: ["password"] } }]
            },
            {
              model: Coordinate
            }
          ]
        });

        res.json(clinics);
      } else {
        const clinics = await Clinic.findAll({
          include: [
            {
              model: Review,
              as: "reviews",
              include: [{ model: User, attributes: { exclude: ["password"] } }]
            },
            {
              model: Coordinate
            }
          ]
        });
        res.json(clinics);
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })
  .post([verifyToken, verifyAdmin], async (req, res) => {
    try {
      const clinic = await Clinic.create(req.body, { include: [Coordinate] });
      res.status(201).json(clinic);
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      // const Op = Sequelize.Op;
      const clinic = await Clinic.findAll({
        where: { id: id }, //match based on id
        include: [
          {
            model: Review,
            as: "reviews",
            include: [{ model: User, attributes: { exclude: ["password"] } }]
          },
          {
            model: Coordinate
          }
        ]
      });
      res.json(clinic);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })
  .put([verifyToken, verifyAdmin], async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await Clinic.findOne({
        where: { id },
        include: [Coordinate]
      });
      if (!clinic) {
        return res.sendStatus(400);
      }
      const updatedClinic = await clinic.update(req.body, {
        returning: true
      });
      return res.status(202).json(updatedClinic);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })
  .delete([verifyToken, verifyAdmin], async (req, res) => {
    try {
      const { id } = req.params;
      await Clinic.destroy({
        where: { id },
        include: [Coordinate]
      });
      res.status(202).end();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

router
  .route("/:id/reviews")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      if (id) {
        const reviews = await Review.findAll({
          where: { clinicId: id }
          // include: [
          //   {
          //     model: User,
          //     as: "users"
          //   }
          // ]
        });
      }
      res.json(reviews);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      if (id) {
        const reviews = await Review.findAll(
          {
            where: { clinicId: id }
          },
          { include: [{ model: [User] }] }
        );
        const review = await Review.create(req.body, { include: [User] });
        res.json(reviews);
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

module.exports = router;
