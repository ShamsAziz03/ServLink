import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ChangePassword() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const ip = process.env.EXPO_PUBLIC_IP;
  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    };
    loadUser();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://${ip}:5000/api/users/${user.user_id}/changePassword`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Password updated successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to change password");
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
     <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={35} color="#94469dff" />
        </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Password</Text>

          <TextInput
            label="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.button}
            labelStyle={{ fontWeight: "bold" }}
          >
            Update Password
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
    paddingTop: 0,
    paddingBottom: 90,
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
  backBtn:{
    padding:20
  },
});
