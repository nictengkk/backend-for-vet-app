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
      password: type.STRING
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: customer => {
          const salt = bcrypt.genSaltSync(10);
          customer.password = bcrypt.hashSync(customer.password, salt);
        }
      },
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
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
