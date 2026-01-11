import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/users.css"; 
import { FaUser, FaSearch } from "react-icons/fa";

const Colors = {
  primary: "#6c3483",
  secondary: "#94469dff",
  background: "#f5f0fa",
  textSecondary: "#6B7280",
  softPurple: "#F3E8FF",
  danger: "#EF4444",
  success: "#22C55E",
};

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const ip =  "localhost";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://${ip}:5000/api/UserswithBookings`);
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (text) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://${ip}:5000/api/search-users?search=${text}`
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        fetchUsers();
      } else {
        searchUsers(search);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleBlock = async (item) => {
    try {
      await axios.put(`http://${ip}:5000/api/block-user`, {
        user_id: item.user_id,
        is_blacklisted: item.is_blacklisted === 1 ? 0 : 1,
      });
      fetchUsers();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="users-container">
      {/* Header */}
      <div className="header">
        <FaUser size={28} color={Colors.primary} />
        <div style={{ marginLeft: 10 }}>
          <h2 style={{ color: Colors.primary }}>ServLink</h2>
          <p style={{ color: Colors.textSecondary }}>Users Management</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-box" style={{ backgroundColor: Colors.softPurple }}>
        <FaSearch color={Colors.primary} />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="users-list">
          {users.map((item) => (
            <div key={item.user_id} className="card">
              <div
                className="icon-circle"
                style={{ backgroundColor: Colors.softPurple }}
              >
                <FaUser color={Colors.primary} size={26} />
              </div>

              <div className="card-info">
                <h3 style={{ color: Colors.primary }}>
                  {item.first_name} {item.last_name}
                </h3>
                <p className="info">{item.email}</p>
                <p className="info">Address: {item.city}</p>
                <p className="info">Bookings: {item.bookings_count}</p>

                <div className="status-row">
                  <span
                    className="status-dot"
                    style={{
                      backgroundColor:
                        item.is_blacklisted === 0
                          ? Colors.success
                          : Colors.danger,
                    }}
                  />
                  <span className="status-text">
                    {item.is_blacklisted === 0 ? "Active" : "Blocked"}
                  </span>
                </div>
              </div>

              <button
                className="action-btn"
                style={{
                  backgroundColor:
                    item.is_blacklisted === 0 ? Colors.danger : Colors.success,
                }}
                onClick={() => handleBlock(item)}
              >
                {item.is_blacklisted === 0 ? "Block" : "Unblock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
