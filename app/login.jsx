import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

  const interests = [
    "Cleaning",
    "Painting",
    "Gardening",
    "Decoration",
    "Child Care",
  ];

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  return (
    <LinearGradient
      colors={["#d8b4fe", "#a78bfa", "#594182ff"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
            }}
            style={styles.logo}
          />

          <Text style={styles.title}>
            {isSignup ? "Create Account" : "Welcome Back!"}
          </Text>

          {isSignup && (
            <TextInput
              label="Full Name"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
          )}

          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          {/* Forgot Password for login */}
          {!isSignup && (
            <TouchableOpacity onPress={() => alert("Reset Password Flow")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {isSignup && (
            <>
              {/* Phone & Location */}
              <TextInput
                label="Phone Number"
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />
              <TextInput
                label="Location"
                mode="outlined"
                style={styles.input}
                value={location}
                placeholder="Use button to get location"
                left={<TextInput.Icon icon="map-marker" />}
              />
              <Button
                mode="outlined"
                onPress={getLocation}
                style={{ marginBottom: 10 }}
              >
                Get Current Location
              </Button>

              {/* Interests Section */}
              <Text style={styles.subtitle}>Select Your Interests</Text>
              <View style={styles.checkboxContainer}>
                {interests.map((item) => (
                  <View key={item} style={styles.checkboxRow}>
                    <Checkbox
                      status={
                        checkedItems.includes(item) ? "checked" : "unchecked"
                      }
                      onPress={() => toggleCheckbox(item)}
                      color="#614c86ff"
                    />
                    <Text>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Service Provider Section */}
              <Text style={styles.providerTitle}>Service Provider Section</Text>
              <View style={styles.providerRow}>
                <Checkbox
                  status={isProvider ? "checked" : "unchecked"}
                  onPress={() => setIsProvider(!isProvider)}
                  color="#59467aff"
                />
                <Text style={styles.providerText}>I’m a Service Provider</Text>
              </View>

              {isProvider && (
                <>
                  <TextInput
                    label="Service Type"
                    mode="outlined"
                    style={styles.input}
                  />
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
                      <Image
                        key={index}
                        source={{ uri }}
                        style={styles.imagePreview}
                      />
                    ))}
                  </View>
                </>
              )}
            </>
          )}

          <Button
            mode="contained"
            onPress={() => alert(isSignup ? "Account Created!" : "Logged In!")}
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
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#5a2d80ff",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
  },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: 15 },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#543980ff",
  },
  subtitle: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 16,
    color: "#3e2367ff",
  },
  input: { marginVertical: 8 },
  button: {
    marginTop: 15,
    backgroundColor: "#5e497eff",
    borderRadius: 15,
    paddingVertical: 5,
  },
  uploadButton: { marginTop: 10, backgroundColor: "#a78bfa", borderRadius: 10 },
  switchText: { textAlign: "center", marginTop: 10, color: "#603f97ff" },
  forgotText: {
    textAlign: "right",
    color: "#694c9bff",
    marginVertical: 5,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  checkboxContainer: { flexDirection: "row", flexWrap: "wrap" },
  checkboxRow: { flexDirection: "row", alignItems: "center", width: "50%" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 15 },
  providerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5b21b6",
    marginBottom: 5,
  },
  providerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  providerText: { color: "#5b21b6", fontWeight: "500" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  imagePreview: { width: 90, height: 90, borderRadius: 10, margin: 5 },
});
