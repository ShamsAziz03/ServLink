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
          console.log("No user found");
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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#750d83ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          styles.fullView,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <LinearGradient
          colors={["#fcf4fcff", "#d7afdcff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "94%",
            borderRadius: 20,
            padding: 30,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name="person-off-outline"
            size={80}
            color="#7b3685ff"
            style={{ marginBottom: 20 }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "900",
              color: "#5f0557ff",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            No user data found
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#800776ff",
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            Sign up with us and earn rewards!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#7b117fff",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 20,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
            onPress={() => navigation.navigate("login")}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Go to Login
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Image
            source={{
              uri:
                user.image ||
                "https://cdn-icons-png.flaticon.com/128/11753/11753993.png",
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
          <SettingItem
            icon="edit"
            text="Edit Profile"
            onPress={() => router.push("/editProfile")}
          />
          <SettingItem
            icon="lock"
            text="Change Password"
            onPress={() => router.push("/changePass")}
          />
          <SettingItem
            iconLib="Ionicons"
            icon="notifications-outline"
            text="Notification Settings"
          />
          <SettingItem
            iconLib="Ionicons"
            icon="briefcase-outline"
            text="Become a Provider"
            onPress={() => router.push("/becomeProvider")}
          />
          <SettingItem
            iconLib="Ionicons"
            icon="help-circle-outline"
            text="FAQ / Questions"
            onPress={() => router.push("/q&a")}
          />
          <SettingItem
            iconLib="Ionicons"
            icon="mail-outline"
            text="Contact Us"
            onPress={() => router.push("/contact")}
          />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={["#b57edcff", "#750d83ff"]}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7eaf9ff", height: "100%" },
  scroll: {
    padding: 20,
    alignItems: "center",
    height: "100%",
  },
  card: {
    width: "95%",
    padding: 25,
    alignItems: "center",
    height: "100%",
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
  email: { color: "#6a5c7b", marginBottom: 3, fontSize: 15 },
  city: { color: "#6a5c7b", marginBottom: 6, fontSize: 15 },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "#f7eaf9ff",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
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
  settingText: { marginLeft: 10, color: "#37043a", fontSize: 18 },
  logoutButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  logoutGradient: { paddingVertical: 12, alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
