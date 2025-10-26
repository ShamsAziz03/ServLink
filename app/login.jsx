import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isProvider, setIsProvider] = useState(false);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [birth_date, setbirth_date] = useState("");

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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selected]);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location is required!");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
  };

  // Handle registration
 const handleRegister = async () => {
  const interestsString = checkedItems.join("-");
  const role = isProvider ? "provider" : "user";

  const [first_name, last_name] = fullName.split(" ");

  const data = {
    first_name,
    last_name: last_name || "",
    email,
    phone,
    password,
    address,
    city,
    location_coordinates: location,
    interests: interestsString,
    birth_date,
    role,
  };

  try {
    const response = await fetch("http://192.168.1.14:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await response.text(); // أولًا استلم النص الخام
    console.log("Server response:", text);

    // جرب تحويله إلى JSON فقط إذا كان JSON صالح
    let resData;
    try {
      resData = JSON.parse(text);
    } catch (e) {
      resData = null; // لو مش JSON
    }

    if (response.ok) {
      alert("Account Created!");
    } else {
      alert(resData?.message || "Error occurred");
    }
  } catch (err) {
    alert("Network Error: " + err.message);
  }
};


  return (
    <LinearGradient colors={["#e0c3f2ff", "#b57edcff", "#750d83ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/15181/15181334.png" }}
            style={styles.logo}
          />

          <Text style={styles.title}>{isSignup ? "Create Account" : "Welcome Back!"}</Text>

          {isSignup && (
            <>
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="City"
                value={city}
                onChangeText={setCity}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Birth Date"
                value={birth_date}
                onChangeText={setbirth_date}
                placeholder="YYYY-MM-DD"
                mode="outlined"
                style={styles.input}
              />
            </>
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          {!isSignup && (
            <TouchableOpacity onPress={() => alert("Reset Password Flow")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {isSignup && (
            <>
              <TextInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />
              <TextInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                mode="outlined"
                style={styles.input}
                placeholder="Use button to get location"
                left={<TextInput.Icon icon="map-marker" />}
              />
              <Button mode="outlined" onPress={getLocation} style={{ marginBottom: 10 }}>
                Get Current Location
              </Button>

              <Text style={styles.subtitle}>Select Your Interests</Text>
              <View style={styles.interestsContainer}>
                {interests.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={[
                      styles.interestCard,
                      checkedItems.includes(item.name) && styles.interestCardSelected,
                    ]}
                    onPress={() => toggleCheckbox(item.name)}
                  >
                    <Image source={{ uri: item.icon }} style={styles.interestImage} />
                    <Text
                      style={[
                        styles.interestText,
                        checkedItems.includes(item.name) && styles.interestTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.divider} />

              <Text style={styles.providerTitle}>Service Provider Section</Text>
              <View style={styles.providerRow}>
                <Checkbox
                  status={isProvider ? "checked" : "unchecked"}
                  onPress={() => setIsProvider(!isProvider)}
                  color="#750d83ff"
                />
                <Text style={styles.providerText}>I’m a Service Provider</Text>
              </View>

              {isProvider && (
                <>
                  <TextInput label="Service Type" mode="outlined" style={styles.input} />
                  <TextInput
                    label="Hourly Rate ($)"
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TextInput
                    label="About You"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                  />
                  <TextInput
                    label="Working Hours"
                    mode="outlined"
                    placeholder="e.g. 9:00 AM - 6:00 PM"
                    style={styles.input}
                    left={<TextInput.Icon icon="clock" />}
                  />

                  <Text style={styles.subtitle}>Upload Sample Work</Text>
                  <Button
                    mode="contained"
                    onPress={pickImage}
                    style={styles.uploadButton}
                    labelStyle={{ fontWeight: "bold" }}
                  >
                    Choose Images
                  </Button>

                  <View style={styles.imageContainer}>
                    {images.map((uri, index) => (
                      <Image key={index} source={{ uri }} style={styles.imagePreview} />
                    ))}
                  </View>
                </>
              )}
            </>
          )}

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            labelStyle={{ fontSize: 16, fontWeight: "bold" }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.switchText}>
              {isSignup
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  card: {
    width: "90%",
    backgroundColor: "#f5f0fa",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#37043a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
  },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: 15 },
  title: { textAlign: "center", fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#6a5c7b" },
  subtitle: { marginTop: 10, fontWeight: "600", fontSize: 16, color: "#6a5c7b" },
  input: { marginVertical: 8, backgroundColor: "#ede9fe" },
  button: { marginTop: 15, backgroundColor: "#750d83ff", borderRadius: 15, paddingVertical: 5 },
  uploadButton: { marginTop: 10, backgroundColor: "#78688fff", borderRadius: 10 },
  switchText: { textAlign: "center", marginTop: 10, color: "#6a5c7b" },
  forgotText: { textAlign: "right", color: "#c287c8", marginVertical: 5, textDecorationLine: "underline", fontWeight: "500" },
  checkboxContainer: { flexDirection: "row", flexWrap: "wrap" },
  checkboxRow: { flexDirection: "row", alignItems: "center", width: "50%" },
  divider: { height: 1, backgroundColor: "#c287c8", marginVertical: 15 },
  providerTitle: { fontSize: 16, fontWeight: "600", color: "#6a5c7b", marginBottom: 5 },
  providerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  providerText: { color: "#750d83ff", fontWeight: "500" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  imagePreview: { width: 90, height: 90, borderRadius: 10, margin: 5 },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  interestCard: {
    width: "47%",
    backgroundColor: "#ede9fe",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
  },
  interestCardSelected: {
    borderColor: "#750d83ff",
    backgroundColor: "#750d83ff",
    shadowColor: "#750d83ff",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  interestImage: { width: 45, height: 45, marginBottom: 5 },
  interestText: { fontSize: 15, color: "#6a5c7b", fontWeight: "600" },
  interestTextSelected: { color: "#fff" },
});
