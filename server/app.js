const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const reviewRoutes = require("./routes/reviews");
const openrouterRoutes = require("./routes/openrouter");
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/openrouter", openrouterRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

module.exports = app;