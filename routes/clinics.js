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
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.sendStatus(403);
    }
    const token = authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);
    if (userData) {
      // res.status(201);
      return next();
    }
  } catch (error) {
    console.error(error.message);
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
  .post(async (req, res) => {
    try {
      const clinic = await Clinic.create(req.body, { include: [Coordinate] });
      res.status(201).json(clinic);
    } catch (error) {
      return res.status(400).end(error.message);
    }
  });
//   .put(async (req, res) => {
// try {

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
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await Clinic.findOne({
        where: { id },
        include: [Coordinate]
      });
      const updatedClinic = await clinic.update(req.body, {
        returning: true
      });
      return res.status(202).json(updatedClinic);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(400);
    }
  })
  .delete(async (req, res) => {
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

//
//   .delete(async (req, res) => {
//     try {
//       const book = await Book.destroy({
//         where: { id: req.params.id }
//       });
//       if (book) {
//         return res.sendStatus(202);
//       }
//       return res.sendStatus(400);
//     } catch (error) {
//       console.error(error.message);
//       return res.sendStatus(400);
//     }
//   });

module.exports = router;
