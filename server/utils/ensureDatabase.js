require("dotenv").config();
const { URL } = require("url");

const dbUrl = process.env.DATABASE_URL;
const FORCE_CREATE = process.env.FORCE_CREATE_DB === "true";

if (!dbUrl) {
  console.error("DATABASE_URL environment variable not defined.");
  throw new Error("DATABASE_URL environment variable not defined.");
}

const parsed = new URL(dbUrl);

const dbConfig = {
  user: parsed.username || null,
  password: parsed.password || null,
  host: parsed.hostname || null,
  port: parsed.port || "5432",
  database: (parsed.pathname || "").replace(/^\//, "") || null,
};

const isManagedHost = (host) => {
  if (!host) return false;
  const managedIndicators = [
    "supabase.co",
    "amazonaws.com",
    "rds.amazonaws.com",
    "azure.com",
    "digitaloceanspaces",
    "render.com",
  ];
  return managedIndicators.some((ind) => host.includes(ind));
};

const isLocalHost = (host) =>
  host === "localhost" || host === "127.0.0.1" || host === "::1";

const ensureDatabaseExists = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping database creation in production.");
    return false;
  }

  if (!FORCE_CREATE && isManagedHost(dbConfig.host)) {
    console.log(
      `Detected managed DB host (${dbConfig.host}). Skipping creation. Set FORCE_CREATE_DB=true to override (use with caution).`
    );
    return false;
  }

  if (
    !FORCE_CREATE &&
    !isLocalHost(dbConfig.host) &&
    !isManagedHost(dbConfig.host)
  ) {
    console.log(
      `Non-local host detected (${dbConfig.host}). Skipping automatic DB creation. Set FORCE_CREATE_DB=true to override.`
    );
    return false;
  }

  let pgtools;
  try {
    pgtools = require("pgtools");
  } catch (err) {
    console.error(
      "Missing dependency: pgtools. Install with `npm install pgtools --save-dev` or set FORCE_CREATE_DB=false to skip creation."
    );
    throw err;
  }

  try {
    await pgtools.createdb(
      {
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
      },
      dbConfig.database
    );
    console.log(`Database "${dbConfig.database}" created successfully.`);
    return true;
  } catch (err) {
    if (
      err &&
      (err.name === "duplicate_database" ||
        (err.message && err.message.includes("already exists")))
    ) {
      console.log(`Database "${dbConfig.database}" already exists.`);
      return false;
    } else {
      console.error("Error creating database:", err);
      throw err;
    }
  }
};

module.exports = ensureDatabaseExists;