import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function FavoriteProvidersScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const ip = process.env.EXPO_PUBLIC_IP;
  const BASE_URL =`http://${ip}:5000`;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        const res = await fetch(
          `${BASE_URL}/api/favorites/user/${user.user_id}`
        );
        const data = await res.json();
        console.log("Favorites API response:", data);
        setFavorites(data);
      } catch (err) {
        console.log("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (favorite_id) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this provider from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await fetch(`${BASE_URL}/api/favorites/${favorite_id}`, {
                method: "DELETE",
              });
              setFavorites(
                favorites.filter((f) => f.favorite_id !== favorite_id)
              );
            } catch (err) {
              Alert.alert("Error", "Failed to remove favorite");
            }
          },
        },
      ]
    );
  };

  const renderCard = ({ item }) => (
    <LinearGradient colors={["#ffffff", "#fcfaffff"]} style={styles.card}>
      {/* Name */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="account" size={22} color="#750d83" />
        <Text style={styles.text}>{item.provider_name}</Text>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => removeFavorite(item.favorite_id)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color="#750d83"
          />
        </TouchableOpacity>
      </View>

      {/* Field of work */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="briefcase" size={22} color="#750d83" />
        <Text style={styles.text}>{item.field_of_work}</Text>
      </View>

      {/* aboutProvider */}
      {item.aboutProvider ? (
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="text-box-outline"
            size={22}
            color="#750d83"
          />
          <Text style={styles.aboutProvider}>{item.aboutProvider}</Text>
        </View>
      ) : null}

      {/* Hourly Rate */}
      {item.hourly_rate ? (
        <View style={styles.row}>
          <MaterialCommunityIcons name="cash" size={22} color="#750d83" />
          <Text style={styles.rate}>${item.hourly_rate} / hour</Text>
        </View>
      ) : null}
    </LinearGradient>
  );

  return (
    <LinearGradient colors={["#dfbfe2", "#f1ebf6"]} style={styles.gradient}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorites</Text>
        <MaterialCommunityIcons name="heart" size={28} color="#750d83" />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#750d83"
          style={{ marginTop: 50 }}
        />
      ) : favorites.length === 0 ? (
        <Text style={styles.noData}>No favorite providers found</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.favorite_id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 15 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#750d83" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    flex: 1,
  },
  aboutProvider: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    flex: 1,
    flexWrap: "wrap",
  },
  rate: { marginLeft: 8, fontSize: 15, fontWeight: "bold", color: "#750d83" },
  deleteIcon: { marginLeft: 10 },
  noData: {
    textAlign: "center",
    color: "#750d83",
    fontSize: 16,
    marginTop: 100,
  },
});
