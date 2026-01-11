import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdApps,
  MdGroup,
  MdWork,
  MdCalendarMonth,
  MdChevronRight,
  MdBuild,
} from "react-icons/md";
import "../../css/homeAdmin.css";

const Colors = {
  primary: "#6c3483",
  secondary: "#94469dff",
  textSecondary: "#D1D5DB",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    user_count: 0,
    booking_count: 0,
    service_count: 0,
    provider_count: 0,
    category_count: 0,
  });

  const ip = "localhost";


  useEffect(() => {
    axios
      .get(`http://${ip}:5000/api/adminInfo`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <MdApps size={28} color={Colors.primary} />
        <div>
          <h2>ServLink</h2>
          <p>Admin Dashboard</p>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="hero-card"
        onClick={() => {
          window.location.href = "/admin/users";
        }}
      >
        <MdGroup size={42} color="#fff" />
        <div>
          <h1>{stats.user_count}</h1>
          <span>Total Users</span>
        </div>
      </div>

      {/* CIRCLE CARDS */}
      <div className="grid-2">
        <div className="circle-card" onClick={() => {
          window.location.href = "/admin/providers";
        }}>
          <div className="circle">
            <MdWork size={26} color={Colors.primary} />
          </div>
          <h3>{stats.provider_count}</h3>
          <p>Providers</p>
        </div>

        <div className="circle-card">
          <div className="circle">
            <MdCalendarMonth size={26} color={Colors.primary} />
          </div>
          <h3>{stats.booking_count}</h3>
          <p>Bookings</p>
        </div>
      </div>

      {/* ACTION CARD */}
      <div className="action-card" onClick={() => {
          window.location.href = "/admin/categories";
        }}>
        <MdBuild size={28} color="#fff" />
        <div className="action-text">
          <h4>{stats.category_count} Categories</h4>
          <span>Manage Categories</span>
        </div>
        <MdChevronRight size={32} color="#fff" />
      </div>

      {/* MINIMAL CARD */}
      <div className="minimal-card"onClick={() => {
          window.location.href = "/admin/services";
        }}>
        <div className="icon-box">
          <MdBuild size={24} color={Colors.primary} />
        </div>

        <div>
          <h3>{stats.service_count}</h3>
          <p>Services</p>
        </div>

        <MdChevronRight size={28} color={Colors.primary} />
      </div>
    </div>
  );
}
