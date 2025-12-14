import { getAllServices } from "../models/ServiceModel.js";
import Fuse from "fuse.js";

export const searchServices = async (req, res) => {
  try {
    const query = req.query.q || "";
    const sort = req.query.sort || ""; // asc | desc | ""

    const services = await getAllServices();

    let results = services;

    
    if (query) {
      const fuse = new Fuse(services, {
        keys: [
          "service_name",
          "service_description",
          "category_name",
          "category_description",
          "first_name",
          "last_name"
        ],
        threshold: 0.3,
        ignoreLocation: true,
      });

      results = fuse.search(query).map((r) => r.item);
    }

    
    if (sort === "asc") {
      results.sort((a, b) => a.hourly_rate - b.hourly_rate);
    } else if (sort === "desc") {
      results.sort((a, b) => b.hourly_rate - a.hourly_rate);
    }

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
