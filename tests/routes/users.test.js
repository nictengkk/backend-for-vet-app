const request = require("supertest");
const app = require("../../app");
const { sequelize, Clinic, Review, User } = require("../../models");
const { createClinics } = require("../../seed");

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await createClinics();
});

afterEach(() => {
  jwt.verify.mockReset();
});

afterAll(async () => {
  await sequelize.close();
});

const route = (params = "") => {
  const path = "/api/users";
  return `${path}/${params}`;
};

xdescribe("Users", () => {
  const verifyUsers = (res, expected) => {
    const users = res.body;
    users.forEach((user, index) => {
      expect(user.firstName).toEqual(expected[index].firstName);
      expect(user.lastName).toEqual(expected[index].lastName);
      expect(user.email).toEqual(expected[index].email);
      expect(user.username).toEqual(expected[index].username);
    });
  };

  describe("[GET] Search for users", () => {
    test("successfully returns all users", () => {
      const expectedUsers = [
        {
          firstName: "Bruce",
          lastName: "Banner",
          email: "hulk@avengers.com",
          username: "iamthehulk",
          password: "iamhulkiamgreenaf",
          isAdmin: true
        },
        {
          firstName: "Tony",
          lastName: "Stark",
          email: "ironman@avengers.com",
          username: "iamironman",
          password: "asdasfasfagdgsdafgsadfasfa"
        },
        {
          firstName: "Steve",
          lastName: "Rogers",
          email: "captainamerica@avengers.com",
          username: "iamcaptainamerica",
          password: "asdasfasfagdgsdafgsadfasfa"
        },
        {
          firstName: "Natasha",
          lastName: "Romanoff",
          email: "blackwidow@avengers.com",
          username: "iamaspider",
          password: "asdasfasfagdgsdafgsadfasfa"
        }
      ];
      return request(app)
        .get(route())
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyUsers(res, expectedUsers));
    });
    test("returns user based on username query", () => {
      const expectedUser = [
        {
          firstName: "Tony",
          lastName: "Stark",
          email: "ironman@avengers.com",
          username: "iamironman",
          password: "asdasfasfagdgsdafgsadfasfa"
        }
      ];
      return request(app)
        .get(route())
        .query({ username: "ironman" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyUsers(res, expectedUser));
    });
  });
});
