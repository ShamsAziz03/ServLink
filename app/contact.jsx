import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactUsScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const ip = process.env.EXPO_PUBLIC_IP;

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user.user_id);
        setName(user.name || ""); 
        setEmail(user.email || ""); 
      }
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await fetch(`http://${ip}:5000/contact-us`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Message sent successfully!");
        setMessage("");
      } else {
        alert("Failed to send message!");
      }
    } catch (error) {
      alert("Network error!");
      console.log(error);
    }
  };

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#94469dff"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.card}
        >
          {/* Illustration */}
          <Link href="/profileUser" style={{ marginRight: 220 }}>
            <Ionicons name="arrow-back-outline" size={24} color={"#7b3685ff"} />
          </Link>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/8747/8747881.png",
            }}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Contact Us</Text>

          {/* Name */}
          <View style={styles.inputRow}>
            <Feather name="user" size={20} color="#6a5c7b" style={styles.icon} />
            <TextInput
              placeholder="Full name"
              placeholderTextColor="#a592b3"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputRow}>
            <Feather name="mail" size={20} color="#6a5c7b" style={styles.icon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#a592b3"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Message */}
          <View style={[styles.inputRow, styles.textArea]}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={20}
              color="#6a5c7b"
              style={styles.icon}
            />
            <TextInput
              placeholder="Message..."
              placeholderTextColor="#a592b3"
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <LinearGradient
              colors={["#750d83ff", "#b57edcff"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Submit →</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Social Media */}
          <View style={styles.socialRow}>
            <FontAwesome name="facebook-square" size={30} color="#3b2d4bff" />
            <FontAwesome name="twitter" size={30} color="#3b2d4bff" />
            <FontAwesome name="instagram" size={30} color="#3b2d4bff" />
          </View>
        </KeyboardAvoidingView>
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
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    width: "90%",
    alignItems: "center",
    shadowColor: "#37043a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#37043a",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f0fa",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    width: "100%",
  },
  textArea: {
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    color: "#37043a",
    fontSize: 15,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    width: "100%",
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
});
