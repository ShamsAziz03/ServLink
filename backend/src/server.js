require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const categoryPageRoutes = require("./routes/categoryPageRoutes");
const servicePageRoutes = require("./routes/servicePageRoutes");
const serviceQuestionsRoutes = require("./routes/serviceQuestionsRoutes");
const contactRoute = require("./routes/contactRoutes");
const db = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/homeInfo", homeRoutes);
app.use("/categoryPage", categoryPageRoutes);
app.use("/servicePage", servicePageRoutes);
app.use("/serviceQuestions", serviceQuestionsRoutes);
app.use("/assets", express.static("D:/ServLink/assets"));

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
