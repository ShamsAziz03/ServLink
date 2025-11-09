import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        console.log("❌ No user found");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    alert("Logged out successfully!");
    router.replace("/login");
  };

  const SettingItem = ({ iconLib = "Feather", icon, text, onPress }) => {
    const IconComponent = iconLib === "Ionicons" ? Ionicons : Feather;
    return (
      <TouchableOpacity style={styles.settingRow} onPress={onPress}>
        <IconComponent name={icon} size={20} color="#750d83ff" />
        <Text style={styles.settingText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#750d83ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#750d83ff", fontSize: 18 }}>No user data found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#f1ebf6ff", "#dfbfe2ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image
            source={{
              uri: user.image || "https://cdn-icons-png.flaticon.com/128/11753/11753993.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.city}>{user.city}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Account Settings</Text>
          <SettingItem icon="edit" text="Edit Profile" onPress={() => router.push("/editProfile")} />
          <SettingItem icon="lock" text="Change Password" onPress={() => router.push("/changePass")} />
          <SettingItem iconLib="Ionicons" icon="notifications-outline" text="Notification Settings" />
          <SettingItem iconLib="Ionicons" icon="briefcase-outline" text="Become a Provider" onPress={() => router.push("/becomeProvider")} />
          <SettingItem iconLib="Ionicons" icon="help-circle-outline" text="FAQ / Questions" onPress={() => router.push("/q&a")} />
          <SettingItem iconLib="Ionicons" icon="mail-outline" text="Contact Us" onPress={() => router.push("/contact")} />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={["#b57edcff", "#750d83ff"]} style={styles.logoutGradient}>
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, alignItems: "center" },
  card: {
    width: "95%",
    padding: 25,
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#9333ea",
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#37043a" },
  email: { color: "#6a5c7b", marginBottom: 3 },
  city: { color: "#6a5c7b", marginBottom: 6 },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "#e6d7f5",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#750d83ff",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  settingText: { marginLeft: 10, color: "#37043a", fontSize: 15 },
  logoutButton: { width: "100%", borderRadius: 15, overflow: "hidden", marginTop: 10 },
  logoutGradient: { paddingVertical: 12, alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
