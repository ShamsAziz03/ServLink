import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

/* COLORS */
const Colors = {
  primary: "#6c3483",
  secondary: "#94469dff",
  background: "#fff",
  card: "#6c3483",
  textSecondary: "#D1D5DB",
};

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    user_count: 0,
    booking_count: 0,
    service_count: 0,
    provider_count: 0,
    category_count:0,
  });
    const ip = process.env.EXPO_PUBLIC_IP;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://${ip}:5000/api/adminInfo`);
        //console.log(res);
        setStats(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
      <MaterialCommunityIcons
        name="application"
        size={28}
        color={Colors.primary}
        style={{ marginRight: 12 }}
      />

      <View>
        <Text style={styles.appName}>ServLink</Text>
        <Text style={styles.pageTitle}>Admin Dashboard</Text>
      </View>
    </View>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.heroCard}
      >
        <MaterialCommunityIcons
          name="account-group"
          size={42}
          color="#fff"
        />
        <View>
          <Text style={styles.heroValue}>{stats.user_count}</Text>
          <Text style={styles.heroLabel}>Total Users</Text>
        </View>
      </LinearGradient>

      {/* CIRCLE CARDS */}
      <View style={styles.row}>
        <View style={styles.circleCard}>
          <View style={styles.circle}>
            <MaterialCommunityIcons
              name="account-tie"
              size={26}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.circleValue}>{stats.provider_count}</Text>
          <Text style={styles.circleLabel}>Providers</Text>
        </View>

        <View style={styles.circleCard}>
          <View style={styles.circle}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={26}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.circleValue}>{stats.booking_count}</Text>
          <Text style={styles.circleLabel}>Bookings</Text>
        </View>
      </View>
      {/* ACTION CARD */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/categories")}
      >
        <LinearGradient
          colors={[Colors.secondary, Colors.primary]}
          style={styles.actionCard}
        >
          <MaterialCommunityIcons
            name="briefcase"
            size={28}
            color="#fff"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.actionValue}>{stats.category_count} Categories</Text>
            <Text style={styles.actionLabel}>Manage Categories</Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="#fff"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* MINIMAL CARD */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/services")}
      >
        <View style={styles.minimalCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="hammer-wrench"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.minimalValue}>{stats.service_count}</Text>
            <Text style={styles.minimalLabel}>services</Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={Colors.primary}
            style={{ marginLeft: "auto" }}
          />
        </View>
      </TouchableOpacity>

      
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    // marginLeft:"auto",
    // marginRight:"auto",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  pageTitle: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
 
  /* HERO */
  heroCard: {
    borderRadius: 22,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  heroValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  heroLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  /* CIRCLE */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  circleCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    elevation: 4,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  circleLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* MINIMAL */
  minimalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    gap: 16,
    elevation: 3,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  minimalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  minimalLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* ACTION */
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    padding: 20,
    gap: 12,
    elevation: 6,
    marginBottom: 20,
  },
  actionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  actionLabel: {
    fontSize: 13,
    color: "#F3E8FF",
  },
});
