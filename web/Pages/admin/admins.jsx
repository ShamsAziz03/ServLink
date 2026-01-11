import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admins.css"

export default function AdminManagement() {
  const ip =  "localhost";
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentAdmin(JSON.parse(storedUser));
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`http://${ip}:5000/api/get_admins`);
      setAdmins(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (currentAdmin?.role !== "super_admin") {
      alert("Permission denied");
      return;
    }
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`http://${ip}:5000/api/delete_admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.log(err);
      alert("Failed to delete admin");
    }
  };

  const handleSubmit = async () => {
    if (currentAdmin?.role !== "super_admin") {
      alert("Permission denied");
      return;
    }

    const { first_name, last_name, email, password } = form;
    if (!first_name || !last_name || !email || !password) {
      alert("Fill all required fields!");
      return;
    }

    try {
      await axios.post(`http://${ip}:5000/api/add_admin`, form);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
      });
      fetchAdmins();
    } catch (err) {
      console.log(err);
      alert("Failed to add admin");
    }
  };

  const filteredAdmins = admins.filter((a) =>
    `${a.first_name} ${a.last_name} ${a.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 return (
  <div className="admins-page">
    <h1 className="page-title">Admin Management</h1>

    {/* Search */}
    <input
      type="text"
      placeholder="Search admin..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />

    {/* Add Admin Form */}
    {currentAdmin?.role === "super_admin" && (
      <div className="form-card">
        <h2 className="form-title">Add New Admin</h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <button onClick={handleSubmit} className="add-btn-admin">
          Add Admin
        </button>
      </div>
    )}

    {/* Admin Cards */}
    <div className="admins-grid">
      {filteredAdmins.map((a) => (
        <div key={a.user_id} className="admin-card">
          <div>
            <h3>{a.first_name} {a.last_name}</h3>
            <p>{a.email}</p>
            <p>Role: {a.role}</p>
            {a.phone && <p>Phone: {a.phone}</p>}
            {a.city && <p>City: {a.city}</p>}
          </div>

          <button
            onClick={() => handleDelete(a.user_id)}
            disabled={currentAdmin?.role !== "super_admin"}
            className={
              currentAdmin?.role === "super_admin"
                ? "delete-btn"
                : "delete-btn disabled"
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
);

}
