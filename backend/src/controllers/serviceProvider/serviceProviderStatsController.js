const ServiceProviderModel = require("../../models/serviceProviderModel");


exports.getProviderRatingOrdersEarning = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderRatingOrdersEarning(userId);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching service providers",
      error: err.message,
    });
  }
};
