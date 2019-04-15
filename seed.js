const { User, Clinic, Review, Coordinate } = require("./models");

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
      tel_office: 64816990,
      address: "24 Jalan Kelulut, Singapore 809041, Singapore",
      postal_code: 809041,
      coordinate: { Latitude: 1.38342, Longitude: 103.8756 }
    },
    { include: [Coordinate] }
  );

  const clinic4 = await Clinic.create(
    {
      name: "The Pet Doctors (Tiong Bahru) Veterinary Clinic Pte Ltd",
      tel_office: 62533023,
      address: "11 Boon Tiong Rd, Singapore 161011, Singapore",
      postal_code: 161011,
      coordinate: { Latitude: 1.2861, Longitude: 103.82942 }
    },
    { include: [Coordinate] }
  );

  const clinic5 = await Clinic.create(
    {
      name: "Pets Avenue Veterinary Clinic",
      tel_office: 64710111,
      address: "8 Empress Rd, Singapore 260008, Singapore",
      postal_code: 260008,
      coordinate: { Latitude: 1.31633, Longitude: 103.80525 }
    },
    { include: [Coordinate] }
  );

  const clinic6 = await Clinic.create(
    {
      name: "Republic Veterinary Clinic Pte Ltd",
      tel_office: 67908748,
      address: "1 Jurong West Central 2, Singapore 648886, Singapore",
      postal_code: 648886,
      coordinate: { Latitude: 1.34025, Longitude: 103.70656 }
    },
    { include: [Coordinate] }
  );

  const user = await User.create({
    firstName: "Bruce",
    lastName: "Banner",
    email: "hulk@avengers.com",
    username: "iamthehulk",
    password: "iamhulk",
    imageUrl: "https://avatarfiles.alphacoders.com/586/thumb-58630.jpg",
    isAdmin: true
  });

  const user2 = await User.create({
    firstName: "Tony",
    lastName: "Stark",
    email: "ironman@avengers.com",
    username: "iamironman",
    password: "iamironman",
    imageUrl: "https://avatarfiles.alphacoders.com/759/thumb-75936.jpg"
  });

  const user3 = await User.create({
    firstName: "Steve",
    lastName: "Rogers",
    email: "captainamerica@avengers.com",
    username: "iamcaptainamerica",
    password: "iamcaptainamerica",
    imageUrl: "https://avatarfiles.alphacoders.com/782/thumb-78223.jpg"
  });

  const user4 = await User.create({
    firstName: "Natasha",
    lastName: "Romanoff",
    email: "blackwidow@avengers.com",
    username: "iamaspider",
    password: "iamblackwidow",
    imageUrl: "https://avatarfiles.alphacoders.com/132/thumb-132566.jpg"
  });

  const user5 = await User.create({
    firstName: "T",
    lastName: "'Challa",
    email: "blackpanther@avengers.com",
    username: "iamaspanther",
    password: "iamblackpanther",
    imageUrl: "https://avatarfiles.alphacoders.com/124/thumb-124245.jpg"
  });

  const user6 = await User.create({
    firstName: "Clinton",
    lastName: "Barton",
    email: "hawkeye@avengers.com",
    username: "iamhawkeye",
    password: "iamhawkeye",
    imageUrl: "https://avatarfiles.alphacoders.com/416/thumb-41673.jpg"
  });

  const user7 = await User.create({
    firstName: "Wanda",
    lastName: "Maximoff",
    email: "scarlettwitch@avengers.com",
    username: "iamscarlettwitch",
    password: "iamawitch",
    imageUrl: "https://avatarfiles.alphacoders.com/141/thumb-141274.jpg"
  });

  const user8 = await User.create({
    firstName: "Thor",
    lastName: "Odinson",
    email: "thor@avengers.com",
    username: "iamgodofthunder",
    password: "iamthor",
    imageUrl: "https://avatarfiles.alphacoders.com/127/thumb-127575.jpg"
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

  const review5 = await Review.create({
    description:
      "Clinic is very clean and not crowded as its on appointment basis. Managed to get an appointment on the day itself. Very detailed report and analysis from the vet herself and her colleagues. Thank you for the great service. Btw, they follow up after the consultation as well."
  });

  const review6 = await Review.create({
    description:
      "Professional and excellent vet doctors. The doctors were very patient and caring to my dogs. Explain the diagnosis and answers my questions professionally. Recommend to book before you come. There is a long wait if you do walk-ins."
  });

  const review7 = await Review.create({
    description:
      "Professional & Caring for my baby . It's hard to find passionate vets nowadays ,  I recommend the Animal Doctors & pls keep up the passion!"
  });
  const review8 = await Review.create({
    description:
      "Caring and Helpful staffs and vets. Will go the extra mile to help pets and pet owners through their difficult times. Nice people. Thumbs Up for them."
  });

  //magic methods to link up relationship between models.
  await clinic.addReview(review);
  await clinic2.addReview(review2);
  await clinic2.addReview(review3);
  await clinic3.addReview(review4);
  await clinic6.addReview(review5);
  await clinic4.addReview(review6);
  await clinic4.addReview(review7);
  await clinic5.addReview(review8);
  await user.addReview(review);
  await user2.addReview(review2);
  await user3.addReview(review3);
  await user4.addReview(review4);
  await user5.addReview(review5);
  await user6.addReview(review6);
  await user7.addReview(review7);
  await user8.addReview(review8);
};

const createUser = async () => {
  await User.create({
    firstName: "Carol",
    lastName: "Denvers",
    email: "captainmarvel@avengers.com",
    username: "iemitflames",
    password: "iamcaptainmarvel",
    imageUrl: "https://avatarfiles.alphacoders.com/178/thumb-178080.jpg"
  });
};

module.exports = { createClinics, createUser };
