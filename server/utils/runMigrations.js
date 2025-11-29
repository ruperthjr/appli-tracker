require("dotenv").config();
const { Umzug, SequelizeStorage } = require("umzug");
const { Sequelize } = require("sequelize");

async function runMigrations(providedSequelize) {
  const createdSequelize = !providedSequelize;
  const sequelize =
    providedSequelize ||
    (function createFromEnv() {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error(
          "DATABASE_URL not set. Set process.env.DATABASE_URL to your Supabase/Postgres connection string."
        );
      }

      return new Sequelize(dbUrl, {
        dialect: "postgres",
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: {
          acquire: 60000,
        },
      });
    })();

  const umzug = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    context: {
      queryInterface: sequelize.getQueryInterface(),
      Sequelize: sequelize.constructor,
    },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    await sequelize.authenticate();
    console.log("Database connection authenticated.");

    const executed = await umzug.up();

    if (executed.length === 0) {
      console.log("No pending migrations. Database is up to date.");
    } else {
      console.log(
        `Applied ${executed.length} migration(s):`,
        executed.map((m) => m.name)
      );
    }

    return executed;
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  } finally {
    if (createdSequelize) {
      try {
        await sequelize.close();
        console.log("Closed temporary DB connection.");
      } catch (closeErr) {
        console.warn("Error while closing DB connection:", closeErr);
      }
    }
  }
}

module.exports = runMigrations;

if (require.main === module) {
  runMigrations()
    .then((executed) => {
      const count = executed ? executed.length : 0;
      process.exit(count === 0 ? 0 : 0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}