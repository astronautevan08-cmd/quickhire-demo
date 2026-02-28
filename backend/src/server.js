const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize } = require("./config/db");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "QuickHire API running" });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const port = process.env.PORT || 4001;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();