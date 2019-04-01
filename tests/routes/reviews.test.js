const request = require("supertest");
const app = require("../../app");
const { sequelize, Clinic, Review } = require("../../models");
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
  const path = "/api/clinics";
  return `${path}/${params}/reviews`;
};

xdescribe("Reviews", () => {
  const verifyReviews = (res, expected) => {
    const reviews = res.body;
    reviews.forEach((review, index) => {
      expect(review.description).toEqual(expected[index].description);
      expect(review.clinicID).toEqual(expected[index].clinicId);
    });
  };

  //test for api/clinics/?name=clinic/reviews
  describe("[GET] Search for all reviews ", () => {
    test("Successfully returns all reviews for a clinic", () => {
      const id = 1;
      const expectedReviews = [
        {
          description:
            "Service rendered was excellent. Diagnostic was accurate and very helpful. Thanks to the 2 wonderful veterinarians working there.",
          clinicID: id
        }
      ];
      return request(app)
        .get(route(id))
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyReviews(res, expectedReviews));
    });
  });

  describe("[POST] Post a new review", () => {
    test("fails to add review because user is not logged in", () => {});
  });
});
