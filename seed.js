const { Customer, Clinic, Review, Coordinate } = require("./models");

const createClinics = async () => {
  const clinic = await Clinic.create(
    {
      name: "Singapore Turf Club Equine Hospital",
      tel_office: 68791000,
      address: "1 Turf Club Avenue Singapore Racecourse",
      postal_code: 738078,
      coordinate: { Latitude: 1.42271, Longitude: 103.7627 }
    },
    { include: [Coordinate] }
  );

  const clinic2 = await Clinic.create(
    {
      name: "Acacia Veterinary Clinic",
      tel_office: 64816889,
      address: "338 Ang Mo Kio Ave 1, Singapore 560338, Singapore",
      postal_code: 560338,
      coordinate: { Latitude: 1.36362, Longitude: 103.84852 }
    },
    { include: [Coordinate] }
  );

  const clinic3 = await Clinic.create(
    {
      name: "Allpets & Aqualife Vets Pte Ltd",
      tel_office: "64816990",
      address: "24 Jalan Kelulut, Singapore 809041, Singapore",
      postal_code: 809041,
      coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
    },
    { include: [Coordinate] }
  );

  const customer = await Customer.create({
    name: "Bruce Banner",
    email: "brucebannern@avengers.com",
    password: "asdasfasfagdgsdafgsadfasfa"
  });

  const customer2 = await Customer.create({
    name: "Tony Stark",
    email: "tonystark@avengers.com",
    password: "asdasfasfagdgsdafgsadfasfa"
  });

  const customer3 = await Customer.create({
    name: "Steve Rogers",
    email: "steverogers@avengers.com",
    password: "asdasfasfagdgsdafgsadfasfa"
  });

  const customer4 = await Customer.create({
    name: "Natasha Romanoff",
    email: "natasharomanoff@avengers.com",
    password: "asdasfasfagdgsdafgsadfasfa"
  });

  const review = await Review.create({
    description:
      "Service rendered was excellent. Diagnostic was accurate and very helpful. Thanks to the 2 wonderful veterinarians working there."
  });

  const review2 = await Review.create({
    description:
      "Visited today for my cat ..bitten by another cat. Seen after only a 15 min wait, vet was decisive, didn't try to up-sell, straight to the point and cost less than I expected. Would recommend any time!! Thank you!!"
  });

  const review3 = await Review.create({
    description:
      "Dr.Kong looks like the proverbial ruffian with the heart of gold.And his staff are very good too.I definitely recommend this vet."
  });

  const review4 = await Review.create({
    description:
      "Great and awesome staff who are friendly and helpful unlike other vets like brighton who has a very negative attitude towards the clients. The vet here are willing to go the extra mile to ensure the pets get the best diagnosis unlike others who just diagnose the problem and brush u away and having charge a high price. Allpets prices are super affordable even for my big dog."
  });

  //magic methods to link up relationship between models.
  await clinic.addReview(review);
  await clinic2.addReview(review2);
  await clinic2.addReview(review3);
  await clinic3.addReview(review4);
  await customer.addReview(review);
  await customer2.addReview(review2);
  await customer3.addReview(review3);
  await customer4.addReview(review4);
};

module.exports = createClinics;
