import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../components/BackButton";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setFirstName(parsed.first_name);
        setLastName(parsed.last_name);
        setEmail(parsed.email);
        setPhone(parsed.phone || "");
        setCity(parsed.city || "");
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:5000/api/users/${user.user_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name, last_name, email, phone, city }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ ...user, first_name, last_name, email, phone, city })
        );
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Network Error", err.message);
    }
  };

  if (!user) return null;

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#94469dff"]}
      style={styles.container}
    >
      <BackButton goTo="/profileUser"/>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profile</Text>

          <TextInput
            label="First Name"
            value={first_name}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Last Name"
            value={last_name}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
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

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            labelStyle={{ fontWeight: "bold" }}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
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
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#6a5c7b",
  },
  input: { marginVertical: 8, backgroundColor: "#f1ebf6ff" },
  button: {
    marginTop: 15,
    backgroundColor: "#750d83ff",
    borderRadius: 15,
    paddingVertical: 5,
  },
});
