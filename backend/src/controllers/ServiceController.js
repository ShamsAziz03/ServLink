const Fuse = require("fuse.js");
const { getAllServices } = require("../models/ServiceModel");

exports.searchServices = async (req, res) => {
  try {
    const query = req.query.q || "";
    const sort = req.query.sort || "";

    const services = await getAllServices();
    let results = services;

    if (query) {
      const fuse = new Fuse(services, {
        keys: [
          "service_name",
          "service_description",
          "category_name",
          "first_name",
          "last_name",
        ],
        threshold: 0.4,
      });

      results = fuse.search(query).map(r => r.item);
    }

    if (sort === "asc") {
      results.sort((a, b) => Number(a.hourly_rate) - Number(b.hourly_rate));
    } else if (sort === "desc") {
      results.sort((a, b) => Number(b.hourly_rate) - Number(a.hourly_rate));
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
