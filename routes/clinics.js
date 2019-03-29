const Sequelize = require("sequelize");
const express = require("express");
const router = express.Router();
const {
  Coordinate,
  Clinic,
  Customer,
  Review,
  sequelize
} = require("../models");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const secret = "Avengers unite";
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.sendStatus(403);
    }
    const token = authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);
    if (userData) {
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

      if (name || address) {
        const clinic = await Clinic.findAll(
          {
            where: {
              [Op.or]: [
                {
                  address: { [Op.substring]: address }
                },
                {
                  name: { [Op.substring]: name }
                }
              ]
            } //match based on substring name and address
          },
          {
            include: [
              {
                model: Review,
                include: [Customer]
              }
            ]
          }
        );
        res.json(clinic);
      } else {
        const clinics = await Clinic.findAll();
        res.json(clinics);
      }
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const clinic = await Clinic.create(req.body, { include: [Coordinate] });
      res.status(201).json(clinic);
    } catch (error) {
      return res.status(403).end(error.message);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      // const Op = Sequelize.Op;

      if (name) {
        const clinic = await Clinic.findAll(
          {
            where: { id: id } //match based on id
          },
          {
            include: [
              {
                model: Review,
                include: [Customer]
              }
            ]
          }
        );
        res.json(clinic);
      } else {
        const clinics = await Clinic.findAll();
        res.json(clinics);
      }
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  })
  .put(verifyToken, async (req, res) => {
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
      console.error(error.message);
      return res.sendStatus(400);
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await Clinic.destroy({
        where: { id },
        include: [Coordinate]
      });
      res.status(202).end();
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  });

module.exports = router;
