const bcrypt = require("bcrypt");

module.exports = (sequelize, type) => {
  const Customer = sequelize.define(
    "customer",
    {
      name: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: type.STRING,
        unique: true
      },
      password: type.STRING,
      isAdmin: {
        type: type.BOOLEAN,
        defaultValue: false
      }
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: customer => {
          const salt = bcrypt.genSaltSync(10);
          customer.password = bcrypt.hashSync(customer.password, salt);
        }
      }
    },
    { timestamps: false }
  );

  Customer.associate = models => {
    Customer.hasMany(models.Review);
  };
  return Customer;
};
