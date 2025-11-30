require("dotenv").config();
require("pg");
const app = require("./app");
const setupDatabase = require("./scripts/setup");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await setupDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`Local server up at port: ${PORT}`);
    });

    // Keep the process alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });

  } catch (err) {
    console.error("Failed to launch local server:", err);
    process.exit(1);
  }
})();