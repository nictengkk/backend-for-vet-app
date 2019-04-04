const request = require("supertest");
const app = require("../../app");
const { Coordinate, sequelize, Clinic } = require("../../models");
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
        },
        {
          name: "The Pet Doctors (Tiong Bahru) Veterinary Clinic Pte Ltd",
          tel_office: 62533023,
          address: "11 Boon Tiong Rd, Singapore 161011, Singapore",
          postal_code: 161011,
          coordinate: { Latitude: 1.2861, Longitude: 103.82942 }
        },
        {
          name: "Pets Avenue Veterinary Clinic",
          tel_office: 64710111,
          address: "8 Empress Rd, Singapore 260008, Singapore",
          postal_code: 260008,
          coordinate: { Latitude: 1.31633, Longitude: 103.80525 }
        },
        {
          name: "Republic Veterinary Clinic Pte Ltd",
          tel_office: 67908748,
          address: "1 Jurong West Central 2, Singapore 648886, Singapore",
          postal_code: 648886,
          coordinate: { Latitude: 1.34025, Longitude: 103.70656 }
        }
      ];
      return request(app)
        .get(route())
        .set("Origin", "http://localhost:3000")
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
        .set("Origin", "http://localhost:3000")
        .query({ name: "Allpets" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => {
          verifyClinics(res, expectedClinic);
        });
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
        .set("Origin", "http://localhost:3000")
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
        .set("Origin", "http://localhost:3000")
        .expect("content-type", /json/)
        .expect(200)
        .then(res => {
          verifyClinics(res, expectedClinic);
        });
    });
  });

  describe("[POST] Creates a new clinic", () => {
    test("should not add an existing clinic in database", done => {
      request(app)
        .post(route())
        .set("Origin", "http://localhost:3000")
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
        .set("Origin", "http://localhost:3000")
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
        .send({
          name: "Singapore Turf Club Equine Hospital",
          tel_office: 68791000,
          address: "1 Turf Club Avenue Singapore Racecourse",
          postal_code: 738078,
          coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
        })
        .expect(403);
    });

    test("successfully adds a clinic to database as an admin", () => {
      jwt.verify.mockResolvedValue({ id: 1 });

      return request(app)
        .post(route())
        .set("Origin", "http://localhost:3000")
        .set("Cookie", "sessionCookie=123124")
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
      jwt.verify.mockResolvedValue({ id: 1 });

      const foundClinic = await Clinic.findOne({
        where: { name: "Acacia Veterinary Clinic" },
        include: [Coordinate]
      });
      const id = foundClinic.id;
      return request(app)
        .put(route(id))
        .set("Origin", "http://localhost:3000")
        .set("cookie", "sessionCookie=123124")
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
      jwt.verify.mockResolvedValue({ id: 1 });

      const id = 100;
      request(app)
        .put(route(id))
        .set("Origin", "http://localhost:3000")
        .set("Cookie", "sessionCookie=123124")
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
      jwt.verify.mockResolvedValue({ id: 1 });

      const foundClinic = await Clinic.findOne({
        where: { name: "Singapore Turf Club Equine Hospital" },
        include: [Coordinate]
      });
      const id = foundClinic.id;
      return request(app)
        .delete(route(id))
        .set("Origin", "http://localhost:3000")
        .set("Cookie", "sessionCookie=123124")
        .expect(202);
    });
  });
});
