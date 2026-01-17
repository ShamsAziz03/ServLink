import React, { useState, useContext } from "react";
import "../css/login.css";
import { AppContext } from "../../context/AppContext";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isProvider, setIsProvider] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [birth_date, setBirthDate] = useState("");

  const [serviceType, setServiceType] = useState("");
  const [serviceLocations, setServiceLocations] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [languages, setLanguages] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [certifications, setCertifications] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [images, setImages] = useState([]);
  const [Description, setDescription] = useState("");
  const [idCard, setidCard] = useState("");

  const ip = "localhost";
  const { setLoggedUser } = useContext(AppContext);


  const interests = [
    { name: "Cleaning", icon: "https://cdn-icons-png.flaticon.com/128/994/994928.png" },
    { name: "Painting", icon: "https://cdn-icons-png.flaticon.com/128/681/681582.png" },
    { name: "Gardening", icon: "https://cdn-icons-png.flaticon.com/128/1543/1543908.png" },
    { name: "Decoration", icon: "https://cdn-icons-png.flaticon.com/128/13375/13375974.png" },
    { name: "Child Care", icon: "https://cdn-icons-png.flaticon.com/128/10154/10154448.png" },
    { name: "Teaching", icon: "https://cdn-icons-png.flaticon.com/128/5344/5344646.png" },
  ];

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleRegister = async () => {
    const role = isProvider ? "provider" : "user";
    const [first_name, last_name] = fullName.split(" ");

    const data = {
      first_name,
      last_name: last_name || "",
      email,
      phone,
      password,
      city,
      birth_date,
      interests: checkedItems.join("-"),
      role,
      ...(isProvider && {
        providerData: {
          serviceType,
          Description,
          serviceLocations,
          hourlyRate,
          id_card_number: idCard,
          languages,
          experienceYears,
          certifications,
          aboutYou,
          images,
        },
      }),
    };

    const res = await fetch(`http://${ip}:5000/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    alert(res.ok ? "Account Created!" : json.message);
  };

  const handleLogin = async () => {
    const res = await fetch(`http://${ip}:5000/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok) return alert(json.message);

    setLoggedUser(json.user);
    localStorage.setItem("user", JSON.stringify(json.user));
    alert("Welcome " + json.user.first_name);

    window.location.href = "/admin/home";


  };

  return (

    <div className="auth">
      <div className="auth-card">
        <img
          src="https://cdn-icons-png.flaticon.com/128/15181/15181334.png"
          className="logo"
        />

        <h2>{isSignup ? "Create Account" : "Welcome Back!"}</h2>

        {isSignup && (
          <>
            <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <div className="float-input">
              <input
                type="date"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              <span>Birth Date</span>
            </div>

          </>
        )}

        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {isSignup && (
          <>
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <h4>Select Your Interests</h4>
            <div className="interests">
              {interests.map((item) => (
                <div
                  key={item.name}
                  className={`interest ${checkedItems.includes(item.name) ? "active" : ""}`}
                  onClick={() => toggleCheckbox(item.name)}
                >
                  <img src={item.icon} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <label className="provider-check" htmlFor="provider">
              <input id="provider" type="checkbox" checked={isProvider} onChange={() => setIsProvider(!isProvider)} />
              I'm a Service Provider
            </label>

            {isProvider && (
              <>
                <input placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
                <input placeholder="Description" value={Description} onChange={(e) => setDescription(e.target.value)} />
                <input placeholder="Locations" value={serviceLocations} onChange={(e) => setServiceLocations(e.target.value)} />
                <input placeholder="Hourly Rate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                <input placeholder="Languages" value={languages} onChange={(e) => setLanguages(e.target.value)} />
                <input placeholder="Experience Years" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                <input placeholder="Certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
                <input placeholder="ID Card Number" value={idCard} onChange={(e) => setidCard(e.target.value)} />
                <textarea placeholder="About You" value={aboutYou} onChange={(e) => setAboutYou(e.target.value)} />

                <label className="upload-btn">
                  Upload Images of your works
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleImagePick}
                  />
                </label>

                <div className="images">
                  {images.map((img, i) => <img key={i} src={img} />)}
                </div>
              </>
            )}
          </>
        )}

        <button onClick={isSignup ? handleRegister : handleLogin}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p onClick={() => setIsSignup(!isSignup)} className="switch">
          {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
