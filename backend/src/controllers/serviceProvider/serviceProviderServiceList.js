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

exports.deleteProviderService = async (req, res) => {
  try {
    const Provider_Services_id = req.params.Provider_Services_id;
    const result = await ServiceProviderModel.deleteProviderService(
      Provider_Services_id
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error delete provider service",
      error: err.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const result = await ServiceProviderModel.getAllCategories();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all categories",
      error: err.message,
    });
  }
};

exports.updateServiceInfo = async (req, res) => {
  try {
    const {
      base_price,
      service_location,
      Provider_Services_id,
      serviceName,
      categoryName,
      description,
      images,
    } = req.body;
    const result = await ServiceProviderModel.updateServiceInfo(
      base_price,
      service_location,
      Provider_Services_id,
      serviceName,
      categoryName,
      description,
      images
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error update provider service",
      error: err.message,
    });
  }
};

exports.addService = async (req, res) => {
  try {
    const {
      base_price,
      service_location,
      serviceName,
      categoryName,
      description,
      images,
      user_id,
      service_cover_image,
    } = req.body;
    const result = await ServiceProviderModel.addService(
      base_price,
      service_location,
      serviceName,
      categoryName,
      description,
      images,
      user_id,
      service_cover_image
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new service",
      error: err.message,
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, description, cover_image } = req.body;
    const result = await ServiceProviderModel.addCategory(
      name,
      description,
      cover_image
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new category",
      error: err.message,
    });
  }
};
