module.exports = (sequelize, type) => {
  const Clinic = sequelize.define(
    "clinic",
    {
      name: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tel_office: type.INTEGER,
      address: type.STRING,
      postal_code: type.INTEGER
    },
    { timestamps: false }
  );

  //create association
  Clinic.associate = models => {
    Clinic.hasMany(models.Review);
    Clinic.hasMany(models.Coordinate);
  };
  return Clinic;
};
