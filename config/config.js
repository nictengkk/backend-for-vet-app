module.exports = {
  development: {
    username: "postgres",
    password: "",
    database: "clinicsapi",
    options: {
      dialect: "postgres",
      logging: false
    }
  },
  test: {
    username: "postgres",
    password: "",
    database: "clinicsapi",
    options: {
      dialect: "sqlite",
      storage: ":memory:",
      logging: false
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    options: {
      dialect: "postgres"
    }
  }
};
