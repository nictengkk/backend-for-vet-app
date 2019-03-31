const Sequelize = require("sequelize");
//create the preconfigured sequelize instance
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
let sequelize;
//Connect to different database depending on env
if (env === "production") {
  sequelize = new Sequelize(config.url, config.options);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
  );
}

//pass the models to the connection
const models = {
  Clinic: sequelize.import("./Clinic"),
  User: sequelize.import("./User"),
  Review: sequelize.import("./Review"),
  Coordinate: sequelize.import("./Coordinate")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

//Link up all models
module.exports = {
  sequelize,
  ...models
};
