module.exports = (sequelize, type) => {
  const Review = sequelize.define(
    "review",
    {
      description: type.STRING(2000),
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    { timestamps: true }
  );

  //create association
  Review.associate = models => {
    Review.belongsTo(models.User);
    Review.belongsTo(models.Clinic);
  };

  return Review;
};
