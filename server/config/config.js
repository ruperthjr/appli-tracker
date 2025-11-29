require("dotenv").config();

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
