import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/services.css";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const ip = "localhost";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`http://${ip}:5000/api/services`);
      setServices(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="services-container">
      <h1 className="services-header">Services</h1>

      <input
        type="text"
        placeholder="Search service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="services-search"
      />

      <div className="services-list">
        {filtered.map((item) => (
          <div className="service-card" key={item.service_id}>
            <img src={item.image} alt={item.service_name} className="service-image" />
            <div className="service-info">
              <h3 className="service-title">{item.service_name}</h3>
              <p className="service-category">Category: {item.category_name}</p>
              <p className="service-desc">{item.description}</p>
              <p className="service-price">Price from: {item.base_price} ₪</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
