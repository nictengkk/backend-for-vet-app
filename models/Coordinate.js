module.exports = (sequelize, type) => {
  const Coordinate = sequelize.define(
    "coordinate",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Latitude: type.FLOAT,
      Longitude: type.FLOAT
    },
    { timestamps: false }
  );

  //create association
  Coordinate.associate = models => {
    Coordinate.hasOne(models.Clinic);
  };
  return Coordinate;
};
