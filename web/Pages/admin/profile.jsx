import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiLock } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";

import "../../css/profile.css";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            setLoading(false);
            return;
        }
        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        alert("Logged out successfully!");
        navigate("/", { replace: true });
    };

    const SettingItem = ({ icon, text, onClick }) => (
        <div className="setting-row" onClick={onClick}>
            {icon}
            <span>{text}</span>
        </div>
    );

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="no-user">
                <IoPersonOutline size={80} color="#804f88ff" />
                <h2>No user data found</h2>
                <p>Sign up with us and earn rewards!</p>
                <button onClick={() => window.location.href("/admin/login")}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img
                    src={
                        user.image ||
                        "https://cdn-icons-png.flaticon.com/128/11753/11753993.png"
                    }
                    alt="avatar"
                />

                <h2>
                    {user.first_name} {user.last_name}
                </h2>
                <p>{user.email}</p>
                <p>{user.city}</p>

                <hr />

                <h3>Account Settings</h3>

                <SettingItem
                    icon={<FiEdit size={18} />}
                    text="Edit Profile"
                    onClick={() => navigate("/admin/editProfile")}
                />

                <SettingItem
                    icon={<FiLock size={18} />}
                    text="Change Password"
                    onClick={() => navigate("/admin/changePass")}
                />



                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
