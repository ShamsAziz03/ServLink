import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/providers.css";

export default function ProvidersAdmin() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSummaries, setAiSummaries] = useState({});
  const [aiLoadingId, setAiLoadingId] = useState(null);


  const ip = "localhost";

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://${ip}:5000/api/ProviderswithBookings`);
      setProviders(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProviders = async (text) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://${ip}:5000/api/search-providers?search=${text}`
      );
      setProviders(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        fetchProviders();
      } else {
        searchProviders(search);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleApprove = async (item) => {
    try {
      await axios.put(`http://${ip}:5000/api/approve-provider`, {
        provider_id: item.provider_id,
        approved_by_admin: item.approved_by_admin === 1 ? 0 : 1,
      });
      fetchProviders();
    } catch (err) {
      console.log(err.message);
    }
  };
  const generateSummary = async (provider) => {
    try {
      setAiLoadingId(provider.provider_id);

      const res = await axios.post(
        `http://${ip}:5000/api/ai/provider-summary`,
        { provider }
      );

      setAiSummaries((prev) => ({
        ...prev,
        [provider.provider_id]: res.data.summary,
      }));

    } catch (err) {
      console.log(err.message);
      setAiSummaries((prev) => ({
        ...prev,
        [provider.provider_id]: "Unable to generate summary right now",
      }));
    } finally {
      setAiLoadingId(null);
    }
  };


  return (
    <div className="modern-container">
      <div className="modern-header">
        <h1>Providers Management</h1>
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="modern-search"
        />
      </div>

      {loading && providers.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="modern-list">
          {providers.map((item) => (
            <div className="modern-card" key={item.provider_id}>
              <div className="modern-card-header">
                <div className="modern-avatar">{item.first_name[0]}</div>
                <div className="modern-info">
                  <h3>{item.first_name} {item.last_name}</h3>
                  <div className={`status ${item.approved_by_admin === 1 ? "approved" : "unapproved"}`}>
                    {item.approved_by_admin === 1 ? "Approved" : "Unapproved"}
                  </div>
                </div>
                <button
                  className={`btn-approve ${item.approved_by_admin === 1 ? "btn-unapprove" : "btn-approve-now"}`}
                  onClick={() => handleApprove(item)}
                >
                  {item.approved_by_admin === 1 ? "Unapprove" : "Approve"}
                </button>
                <button
                  className="btn-ai"
                  onClick={() => generateSummary(item)}
                  disabled={aiLoadingId === item.provider_id}
                >
                  {aiLoadingId === item.provider_id ? "Analyzing..." : "Summarize"}
                </button>

              </div>

              <div className="modern-details">
                <div><strong>Email:</strong> {item.email}</div>
                <div><strong>ID Card:</strong> {item.id_card_number}</div>
                <div><strong>City:</strong> {item.city}</div>
                <div><strong>Field:</strong> {item.field_of_work}</div>
                <div><strong>Experience:</strong> {item.years_of_experience} yrs</div>
                <div><strong>Hourly Rate:</strong> ${item.hourly_rate}/hr</div>
                <div><strong>Service Locations:</strong> {item.service_locations}</div>
                <div><strong>Bookings:</strong> {item.bookings_count}</div>
                <div><strong>Debts:</strong> {item.debt}</div>
              </div>

              <div className="modern-about">
                <strong>About:</strong>
                <p>{item.aboutProvider}</p>
              </div>
              {aiSummaries[item.provider_id] && (
                <div className="modern-ai-summary">
                  <strong>AI Summary about {item.first_name} {item.last_name} :</strong>
                  <p>{aiSummaries[item.provider_id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
