const ServiceProviderModel = require("../../models/serviceProviderModel");

exports.getProviderRatingOrdersEarning = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderRatingOrdersEarning(
      userId
    );
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching service providers",
      error: err.message,
    });
  }
};

exports.getProviderCancelledPendingOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderCancelledPendingOrders(
      userId
    );
    if (!result.length) {
  console.log("no");
}

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching cancelled and pending orders",
      error: err.message,
    });
  }
};

exports.getProviderServicePerformance = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderServicePerformance(
      userId
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching service performence",
      error: err.message,
    });
  }
};

exports.getProviderMonthlyEarnings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderMonthlyEarnings(
      userId
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching monthly earnings",
      error: err.message,
    });
  }
};