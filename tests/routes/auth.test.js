const request = require("supertest");
const app = require("../../app");
const { sequelize, Clinic, Review } = require("../../models");

const { createUser } = require("../../seed");

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await createUser();
});

afterEach(() => {
  jwt.verify.mockReset();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Authentication", () => {
  test("successfully creates a new user on signup", () => {
    const route = "/signup";
    return request(app)
      .post(route)
      .set("Origin", "http://localhost:3000")
      .send({
        firstName: "test",
        lastName: "tester",
        email: "test@test.com",
        password: "testing123",
        username: "tester123",
        imageUrl: "https://avatarfiles.alphacoders.com/175/thumb-175981.jpg"
      })
      .expect(201)
      .then(res => {
        const user = res.body;
        expect(user).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            firstName: "test",
            lastName: "tester",
            username: "tester123"
          })
        );
      });
  });

  test("should not register a user if email already exist", () => {
    const route = "/signup";
    return request(app)
      .post(route)
      .set("Origin", "http://localhost:3000")
      .send({
        firstName: "Carol",
        lastName: "Denvers",
        username: "iemitflames",
        email: "captainmarvel@avengers.com",
        password: "iamcaptainmarvel",
        imageUrl: "https://avatarfiles.alphacoders.com/178/thumb-178080.jpg"
      })
      .expect(400);
  });

  test("Fails to login a user as there are no existing records in db", () => {
    const route = "/login";
    return request(app)
      .post(route)
      .set("Origin", "http://localhost:3000")
      .send({
        username: "test",
        password: "testing123"
      })
      .expect(400)
      .then(res => {
        const body = res.body;
        expect(body.error.message).toEqual("User does not exist");
      });
  });

  test("successfully logs in an existing user", () => {
    const route = "/login";
    return request(app)
      .post(route)
      .set("Origin", "http://localhost:3000")
      .send({
        username: "iemitflames",
        password: "iamcaptainmarvel"
      })
      .expect(201);
  });

  test("successfully logs out a user", () => {
    const route = "/logout";
    return request(app)
      .post(route)
      .set("Origin", "http://localhost:3000")
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body.message).toEqual("You are successfully logged out");
      });
  });
});
