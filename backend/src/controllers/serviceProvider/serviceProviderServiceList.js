const ServiceProviderModel = require("../../models/serviceProviderModel");


exports.getProviderListServicesInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ServiceProviderModel.getProviderListServicesInfo(
      userId
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider list services",
      error: err.message,
    });
  }
};

exports.getProviderServiceFeedbacks = async (req, res) => {
  try {
    const Provider_Services_id = req.params.Provider_Services_id;
    const result = await ServiceProviderModel.getProviderServiceFeedbacks(
      Provider_Services_id
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider feedbacks for service",
      error: err.message,
    });
  }
};

exports.getProviderServiceAvgRating = async (req, res) => {
  try {
    const Provider_Services_id = req.params.Provider_Services_id;
    const result = await ServiceProviderModel.getProviderServiceAvgRating(
      Provider_Services_id
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider avg rating for service",
      error: err.message,
    });
  }
};