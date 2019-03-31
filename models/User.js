const bcrypt = require("bcrypt");

module.exports = (sequelize, type) => {
  const User = sequelize.define(
    "user",
    {
      name: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: type.STRING,
        unique: {
          args: true,
          msg: "This email is already taken"
        },
        validate: {
          isEmail: true
        }
      },
      username: { type: type.STRING, unique: true },
      password: {
        type: type.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter password"
          }
        }
      },
      isAdmin: {
        type: type.BOOLEAN,
        defaultValue: false
      }
    },
    {
      hooks: {
        beforeCreate: user => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      }
    },
    { timestamps: false }
  );

  User.associate = models => {
    User.hasMany(models.Review);
  };
  return User;
};
