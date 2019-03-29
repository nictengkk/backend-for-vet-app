const request = require("supertest");
const app = require("../../app");
const { Coordinate, sequelize, Clinic } = require("../../models");
const createClinics = require("../../seed");

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
  return `${path}/${params}`;
};

describe("Clinics", () => {
  const verifyClinics = (res, expected) => {
    const clinics = res.body;
    clinics.forEach((clinic, index) => {
      expect(clinic.name).toEqual(expected[index].name);
      expect(clinic.address).toEqual(expected[index].address);
    });
  };

  describe("[GET] Search for clinics", () => {
    test("Successfully returns all clinics", () => {
      const expectedClinics = [
        {
          name: "Singapore Turf Club Equine Hospital",
          tel_office: 68791000,
          address: "1 Turf Club Avenue Singapore Racecourse",
          postal_code: 738078,
          coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
        },
        {
          name: "Acacia Veterinary Clinic",
          tel_office: 64816889,
          address: "338 Ang Mo Kio Ave 1, Singapore 560338, Singapore",
          postal_code: 560338,
          coordinate: { Latitude: 1.36362, Longitude: 103.84852 }
        },
        {
          name: "Allpets & Aqualife Vets Pte Ltd",
          tel_office: "64816990",
          address: "24 Jalan Kelulut, Singapore 809041, Singapore",
          postal_code: 809041,
          coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
        }
      ];
      return request(app)
        .get(route())
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyClinics(res, expectedClinics));
    });

    test("returns clinic based on name query", () => {
      const expectedClinic = [
        {
          name: "Allpets & Aqualife Vets Pte Ltd",
          tel_office: "64816990",
          address: "24 Jalan Kelulut, Singapore 809041, Singapore",
          postal_code: 809041,
          coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
        }
      ];

      return request(app)
        .get(route())
        .query({ name: "Allpets" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyClinics(res, expectedClinic));
    });

    test("returns clinic based on partial address query", () => {
      const expectedClinic = [
        {
          name: "Allpets & Aqualife Vets Pte Ltd",
          tel_office: "64816990",
          address: "24 Jalan Kelulut, Singapore 809041, Singapore",
          postal_code: 809041,
          coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
        }
      ];

      return request(app)
        .get(route())
        .query({ address: "Kelulut" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyClinics(res, expectedClinic));
    });

    test("returns clinic(s) based on id query", () => {
      const id = 3;
      const expectedClinic = [
        {
          name: "Allpets & Aqualife Vets Pte Ltd",
          id: 3,
          tel_office: "64816990",
          address: "24 Jalan Kelulut, Singapore 809041, Singapore",
          postal_code: 809041,
          coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
        }
      ];

      return request(app)
        .get(route(id))
        .query({ id: 3 })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => verifyClinics(res, expectedClinic));
    });
  });

  describe("[POST] Creates a new clinic", () => {
    test("should not add an existing clinic in database", done => {
      request(app)
        .post(route())
        .send({
          name: "Singapore Turf Club Equine Hospital",
          tel_office: 68791000,
          address: "1 Turf Club Avenue Singapore Racecourse",
          postal_code: 738078,
          coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
        })
        .expect(403, done);
    });

    test("denies access when no token is given", done => {
      request(app)
        .post(route())
        .send({
          name: "Singapore Turf Club Equine Hospital",
          tel_office: 68791000,
          address: "1 Turf Club Avenue Singapore Racecourse",
          postal_code: 738078,
          coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
        })
        .expect(403, done);
    });

    test("denies access when invalid token is given", async () => {
      await jwt.verify.mockRejectedValueOnce(new Error("Is invalid token"));

      return request(app)
        .post(route())
        .set("Authorization", "Bearer some-invalid-token")
        .send({
          name: "Singapore Turf Club Equine Hospital",
          tel_office: 68791000,
          address: "1 Turf Club Avenue Singapore Racecourse",
          postal_code: 738078,
          coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
        })
        .expect(403);
    });

    test("successfully adds a clinic to database", () => {
      jwt.verify.mockResolvedValueOnce("is-valid");

      return request(app)
        .post(route())
        .set("Authorization", "Bearer a-valid-token")
        .send({
          name: "Amber Veterinary Practice Pte Ltd",
          tel_office: 62455543,
          address: "50 Burnfoot Ter, Singapore 459837, Singapore",
          postal_code: 459837,
          coordinate: { Latitude: 1.31265, Longitude: 103.92275 }
        })
        .expect(201)
        .then(res => {
          const clinic = res.body;
          expect(clinic.name).toBe("Amber Veterinary Practice Pte Ltd");
          expect(clinic.tel_office).toBe(62455543);
          expect(clinic.address).toBe(
            "50 Burnfoot Ter, Singapore 459837, Singapore"
          );
          expect(clinic.postal_code).toBe(459837);
          expect(clinic.coordinate).toEqual({
            id: expect.any(Number),
            Latitude: 1.31265,
            Longitude: 103.92275
          });
        });
    });
  });

  describe("[PUT] Edits a clinic", () => {
    test("successfully edit an existing clinic with valid token", async () => {
      jwt.verify.mockResolvedValueOnce("is-valid");

      const foundClinic = await Clinic.findOne({
        where: { name: "Acacia Veterinary Clinic" },
        include: [Coordinate]
      });
      const id = foundClinic.id;
      return request(app)
        .put(route(id))
        .set("Authorization", "Bearer a-valid-token")
        .send({
          name: "Acacia Veterinary Clinic Pte Ltd",
          tel_office: 64816889,
          address: "338 Ang Mo Kio Ave 1, Singapore 560338, Singapore",
          postal_code: 560338,
          coordinate: { Latitude: 1.36362, Longitude: 103.84852 }
        })
        .expect(202)
        .then(res => {
          const clinic = res.body;
          expect(clinic.name).toBe("Acacia Veterinary Clinic Pte Ltd");
          expect(clinic.tel_office).toBe(64816889);
          expect(clinic.address).toBe(
            "338 Ang Mo Kio Ave 1, Singapore 560338, Singapore"
          );
          expect(clinic.postal_code).toBe(560338);
          expect(clinic.coordinate).toEqual(
            expect.objectContaining({
              Latitude: 1.36362,
              Longitude: 103.84852
            })
          );
        });
    });

    test("fails to update clinic as it does not exist", done => {
      jwt.verify.mockResolvedValueOnce("is-valid");

      const id = 100;
      request(app)
        .put(route(id))
        .set("Authorization", "a-valid-token")
        .send({
          id: 2,
          name: "Acacia Veterinary Clinic Pte Ltd",
          tel_office: 64816889,
          address: "338 Ang Mo Kio Ave 1, Singapore 560338, Singapore",
          postal_code: 560338,
          coordinate: { Latitude: 1.36362, Longitude: 103.84852 }
        })
        .expect(400, done);
    });
  });

  describe("[DELETE] Removes a clinic", () => {
    test("Successfully delete a clinic", async () => {
      jwt.verify.mockResolvedValueOnce("is-valid");

      const foundClinic = await Clinic.findOne({
        where: { name: "Singapore Turf Club Equine Hospital" },
        include: [Coordinate]
      });
      const id = foundClinic.id;
      return request(app)
        .delete(route(id))
        .set("Authorization", "Bearer a-valid-token")
        .expect(202);
    });
  });
});
