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
const bookingRoutes = require("./routes/bookingRoutes");
const db = require("./config/db");
const ratingRoutes = require("./routes/ratingRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookingServiceRoutes = require("./routes/bookingServiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceProviderStats = require("./routes/serviceProvider/serviceProviderStatsRoutes");
const serviceProviderServiceListRoutes = require("./routes/serviceProvider/serviceProviderServiceList");
const serviceProviderScheduleUnavailableDatesRoutes = require("./routes/serviceProvider/serviceProviderScheduleUnavailableDates");
const providerBookings = require("./routes/serviceProvider/serviceProviderRequestsRoutes");

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
app.use("/api/ratings", ratingRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use(express.json());
app.use("/", contactRoute);

app.use("/api/bookings", bookingRoutes);

app.use("/api/favorites", favoriteRoutes);
//for service booking
app.use("/bookingService", bookingServiceRoutes);
app.use("/api/services", serviceRoutes);

//for payment
app.use("/payment", paymentRoutes);

//for SP role
app.use("/serviceProviderStats", serviceProviderStats);
app.use("/serviceProviderServiceList", serviceProviderServiceListRoutes);
app.use(
  "/providerScheduleUnavailableDates",
  serviceProviderScheduleUnavailableDatesRoutes
);
app.use("/providerBookings", providerBookings);

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
