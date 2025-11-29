require("dotenv").config();
require("pg");
const app = require("./app");
const setupDatabase = require("./scripts/setup");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await setupDatabase();
    app.get("/", (_, res) =>
      res.send("<h1>Appli Tracker Server</h1><p>Server is running locally!</p>")
    );

    app.listen(PORT, () => console.log(`Local server up at port: ${PORT}`));
  } catch (err) {
    console.error("Failed to launch local server:", err);
    process.exit(1);
  }
})();