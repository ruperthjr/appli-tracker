require("dotenv").config();
const { sequelize } = require("../models");
const ensureDatabaseExists = require("../utils/ensureDatabase");
const runMigrations = require("../utils/runMigrations");

const setupDatabase = async () => {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  console.log("Connected to database.");

  await runMigrations(sequelize);
  console.log("Migrations completed.");
};

module.exports = setupDatabase;

if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Setup error:", err);
      process.exit(1);
    });
}