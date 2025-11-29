const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const reviewRoutes = require("./routes/reviews");
const openrouterRoutes = require("./routes/openrouter");

const app = express();

const allowedOrigins = [
  "https://appli-tracker.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("<h1>Appli Tracker API</h1><p>API server is running.</p>");
});

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/openrouter", openrouterRoutes);

module.exports = app;