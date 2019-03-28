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

      if (name) {
        const clinic = await Clinic.findAll(
          {
            where: {
              [Op.or]: [
                {
                  name: { [Op.substring]: name }
                },
                {
                  address: { [Op.substring]: address }
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
      const Op = Sequelize.Op;
      const { name, address, tel_office, postal_code, coordinates } = req.body;
      await sequelize.transaction(async t => {
        const foundClinic = await Clinic.findOne({
          where: {
            [Op.or]: [
              {
                name: name
              },
              {
                address: address
              }
            ]
          },
          transaction: t
        });

        if (foundClinic) {
          return res
            .status(400)
            .json({ error: { message: "clinic already exists" } });
        }
        const newClinic = await Clinic.create(
          {
            name: name,
            tel_office: tel_office,
            address: address,
            postal_code: postal_code,
            coordinates: coordinates
          },
          { include: [Coordinate] },
          { transaction: t }
        );
        res.status(201).json(newClinic);
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: "clinic already exists" } });
    }
  });

router.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const Op = Sequelize.Op;
    // const { name } = req.query;

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
});

//   .post(verifyToken, async (req, res) => {
//     try {
// const { title, author } = req.body;
// const foundAuthor = await Author.findOne({ where: { name: author } });

// if (!foundAuthor) {
//   const createdBook = await Book.create(
//     { title, author: { name: author } },
//     { include: [Author] }
//   );
//   return res.status(201).json(createdBook);
// }
// const createdBook = await Book.create(
//   { title, authorId: foundAuthor.id },
//   { include: [Author] }
// );
// return res.status(201).json(createdBook);

//Alternative using findOrCreate
//   const { title, author } = req.body;
//   await sequelize.transaction(async t => {
//     const [foundAuthor] = await Author.findOrCreate({
//       where: {
//         name: author
//       },
//       transaction: t
//     });
//     const newBook = await Book.create({ title: title }, { transaction: t });
//     await newBook.setAuthor(foundAuthor, { transaction: t });
//     const newBookWithAuthor = await Book.findOne({
//       where: { id: newBook.id },
//       include: [Author],
//       transaction: t
//     });
//     res.status(201).json(newBookWithAuthor);
//   });
// } catch (error) {
//   console.error(error.message);
//   return res.status(400);
// }
//   });

// router.route("/:id");
//   .put(async (req, res) => {
//     try {
//       const book = await Book.findOne({
//         where: { id: req.params.id },
//         include: [Author]
//       });
//       const [foundAuthor] = await Author.findOrCreate({
//         where: { name: req.body.author }
//       });

//       await book.update({ title: req.body.title });
//       await book.setAuthor(foundAuthor);
//       const updatedBook = await Book.findOne({
//         where: { id: book.id },
//         include: [Author]
//       });
//       return res.status(202).json(updatedBook);
//     } catch (error) {
//       console.error(error.message);
//       return res.status(400).end();
//     }
//   })
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
