require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const contactRoute = require("./routes/contactRoutes");
const db = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use(express.json());
app.use("/", contactRoute);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("DB connected successfully");
    connection.release();
  }
});
