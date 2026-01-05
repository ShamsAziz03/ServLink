import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Colors = {
  primary: "#6c3483",
  background: "#fff",
  textSecondary: "#6B7280",
  softPurple: "#F3E8FF",
  danger: "#EF4444",
  success: "#22C55E",
  lightGray: "#F5F5F5",
};

export default function ProvidersAdmin() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

    const ip = process.env.EXPO_PUBLIC_IP;
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://${ip}:5000/api/ProviderswithBookings`);
      setProviders(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProviders = async (text) => {
    try {
      setLoading(true);
      const res = await axios.get(
<<<<<<< HEAD
        `http://192.168.1.12:5000/api/search-providers?search=${text}`
=======
        `http://${ip}:5000/api/search-providers?search=${text}`
>>>>>>> fb2728f8afa0df6127a6d270d2d743c07b1b16d3
      );
      setProviders(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        fetchProviders();
      } else {
        searchProviders(search);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleApprove = async (item) => {
    try {
<<<<<<< HEAD
      await axios.put("http://192.168.1.12:5000/api/approve-provider", {
=======
      await axios.put(`http://${ip}:5000/api/approve-provider`, {
>>>>>>> fb2728f8afa0df6127a6d270d2d743c07b1b16d3
        provider_id: item.provider_id,
        approved_by_admin: item.approved_by_admin === 1 ? 0 : 1,
      });
      fetchProviders();
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account"
            size={40}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.profileName}>
          {item.first_name} {item.last_name}
        </Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.approved_by_admin === 1
                    ? Colors.success
                    : Colors.danger,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {item.approved_by_admin === 1 ? "Approved" : "Unapproved"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleApprove(item)}
          style={[
            styles.approveBtn,
            {
              backgroundColor:
                item.approved_by_admin === 1
                  ? Colors.danger
                  : Colors.success,
            },
          ]}
        >
          <Text style={styles.approveText}>
            {item.approved_by_admin === 1 ? "Unapprove" : "Approve"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{item.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>ID Card</Text>
        <Text style={styles.value}>{item.id_card_number}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>{item.city}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Field of Work</Text>
        <Text style={styles.value}>{item.field_of_work}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Experience</Text>
        <Text style={styles.value}>
          {item.years_of_experience} years
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Hourly Rate</Text>
        <Text style={styles.value}>{item.hourly_rate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Service Locations</Text>
        <Text style={styles.value}>{item.service_locations}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Bookings</Text>
        <Text style={styles.value}>{item.bookings_count}</Text>
      </View>
      <View style={styles.aboutBox}>
        <Text style={styles.label}>About Provider</Text>
        <Text style={styles.aboutText}>{item.aboutProvider}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="account-group"
          size={28}
          color={Colors.primary}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.appName}>ServLink</Text>
          <Text style={styles.pageTitle}>Providers Management</Text>
        </View>
      </View>
      <View style={styles.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={Colors.primary}
        />
        <TextInput
          placeholder="Search providers..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      {loading && providers.length === 0 ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item, index) =>
            (item.provider_id || item.user_id || index).toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshing={loading}
          onRefresh={fetchProviders}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  pageTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.softPurple,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  profileCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.softPurple,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  profileName: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.primary,
  },
  section: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 13,
    color: "#111",
  },
  aboutBox: {
    marginTop: 10,
    backgroundColor: Colors.softPurple,
    padding: 12,
    borderRadius: 14,
  },
  aboutText: {
    fontSize: 13,
    color: "#111",
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  approveBtn: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 14,
  },
  approveText: {
    color: "#fff",
    fontWeight: "600",
  },
});
