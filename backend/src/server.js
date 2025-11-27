require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const contactRoute = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const db = require("./config/db");
const ratingRoutes = require("./routes/ratingRoutes");



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/homeInfo", homeRoutes);
app.use("/assets", express.static("D:/ServLink/assets"));
app.use("/api/ratings", ratingRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use(express.json());
app.use("/", contactRoute);

app.use("/api/bookings", bookingRoutes);

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
