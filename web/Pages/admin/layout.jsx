import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../css/layout.css";

export default function AppLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>ServLink</h2>
        <nav>
          <ul>
            <li><Link to="/admin/home">Dashboard</Link></li>
            <li><Link to="/admin/providers">Service Providers</Link></li>
            <li><Link to="/admin/categories">Categories</Link></li>
            <li><Link to="/admin/services">Services</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/admins">Admins</Link></li>
            <li><Link to="/admin/profile">Profile</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet /> {/* هنا بتظهر كل صفحة حسب Route */}
      </main>
    </div>
  );
}
