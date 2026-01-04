import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Colors = {
  primary: "#6c3483",
  secondary: "#94469dff",
  background: "#fff",
  textSecondary: "#6B7280",
  softPurple: "#F3E8FF",
  danger: "#EF4444",
  success: "#22C55E",
};

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://ip:5000/api/UserswithBookings"
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (text) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://ip:5000/api/search-users?search=${text}`
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH EFFECT (DEBOUNCE) ================= */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        fetchUsers(); // 🔥 رجوع لكل المستخدمين
      } else {
        searchUsers(search);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleBlock = async (item) => {
    try {
      await axios.put("http://ip:5000/api/block-user", {
        user_id: item.user_id,
        is_blacklisted: item.is_blacklisted === 1 ? 0 : 1,
      });
      fetchUsers();
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="account"
          size={26}
          color={Colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name}
        </Text>

        <Text style={styles.info}>{item.email}</Text>
        <Text style={styles.info}>Address: {item.city}</Text>
        <Text style={styles.info}>Bookings: {item.bookings_count}</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.is_blacklisted === 0
                    ? Colors.success
                    : Colors.danger,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {item.is_blacklisted === 0 ? "Active" : "Blocked"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleBlock(item)}
        style={[
          styles.actionBtn,
          {
            backgroundColor:
              item.is_blacklisted === 0
                ? Colors.danger
                : Colors.success,
          },
        ]}
      >
        <Text style={styles.actionText}>
          {item.is_blacklisted === 0 ? "Block" : "Unblock"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="account-group"
          size={28}
          color={Colors.primary}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.appName}>ServLink</Text>
          <Text style={styles.pageTitle}>Users Management</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={Colors.primary}
        />
        <TextInput
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={loading}
        onRefresh={fetchUsers}
      />
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

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.softPurple,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  info: {
    fontSize: 13,
    color: Colors.textSecondary,
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

  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
