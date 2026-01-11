import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "../css/editProfile.css";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const ip = "localhost";

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setFirstName(parsed.first_name);
      setLastName(parsed.last_name);
      setEmail(parsed.email);
      setPhone(parsed.phone || "");
      setCity(parsed.city || "");
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://${ip}:5000/api/users/${user.user_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name, last_name, email, phone, city }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            first_name,
            last_name,
            email,
            phone,
            city,
          })
        );
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="edit-profile-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <IoArrowBack size={32} />
      </button>

      <div className="edit-card">
        <h2>Edit Profile</h2>

        <input
          placeholder="First Name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          placeholder="Last Name"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
