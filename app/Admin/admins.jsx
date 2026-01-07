import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Colors = {
  primary: "#6c3483",
  background: "#fff",
  card: "#6c3483",
  softPurple: "#F3E8FF",
};

export default function AdminManagementScreen() {
  const ip = process.env.EXPO_PUBLIC_IP;

  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  /* ================= FETCH USER + ADMINS ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setCurrentAdmin(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`http://${ip}:5000/api/get_admins`);
      setAdmins(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (currentAdmin?.role !== "super_admin") {
      Alert.alert(
        "Permission denied",
        "You don't have permission to delete admins"
      );
      return;
    }

    Alert.alert(
      "Delete Admin",
      "Are you sure you want to delete this admin?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`http://${ip}:5000/api/delete_admin/${id}`);
              fetchAdmins();
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "Failed to delete admin");
            }
          },
        },
      ]
    );
  };

  /* ================= ADD ================= */
  const handleSubmit = async () => {
    if (currentAdmin?.role !== "super_admin") {
      Alert.alert(
        "Permission denied",
        "You don't have permission to add admins"
      );
      return;
    }

    const { first_name, last_name, email, password } = form;

    if (!first_name || !last_name || !email || !password) {
      Alert.alert(
        "Validation",
        "Please fill first name, last name, email, and password."
      );
      return;
    }

    try {
      await axios.post(`http://${ip}:5000/api/add_admin`, form);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
      });

      fetchAdmins();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to add admin");
    }
  };

  /* ================= FILTER ================= */
  const filteredAdmins = admins.filter((a) =>
    `${a.first_name ?? ""} ${a.last_name ?? ""} ${a.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Feather name="user" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.name}>
            {item.first_name} {item.last_name}
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="mail" size={16} color="#fff" style={styles.icon} />
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={styles.row}>
          <Feather name="shield" size={16} color="#fff" style={styles.icon} />
          <Text style={styles.email}>{item.role}</Text>
        </View>

        {item.phone && (
          <View style={styles.row}>
            <Feather name="phone" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.email}>{item.phone}</Text>
          </View>
        )}

        {item.city && (
          <View style={styles.row}>
            <MaterialIcons
              name="location-city"
              size={16}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.email}>{item.city}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.deleteBtn,
          currentAdmin?.role !== "super_admin" && { opacity: 0.4 },
        ]}
        disabled={currentAdmin?.role !== "super_admin"}
        onPress={() => handleDelete(item.user_id)}
      >
        <Feather name="trash-2" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) return null;

  /* ================= UI ================= */
  return (
    <FlatList
      style={styles.container}
      data={filteredAdmins}
      keyExtractor={(item) => item.user_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 30 }}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Admin Management</Text>

          <TextInput
            placeholder="Search admin..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          {/* ADD ADMIN (SUPER ADMIN ONLY) */}
          {currentAdmin?.role === "super_admin" && (
            <View style={styles.form}>
              <TextInput
                placeholder="First Name"
                value={form.first_name}
                onChangeText={(t) =>
                  setForm({ ...form, first_name: t })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Last Name"
                value={form.last_name}
                onChangeText={(t) =>
                  setForm({ ...form, last_name: t })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={form.email}
                onChangeText={(t) =>
                  setForm({ ...form, email: t })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={form.password}
                onChangeText={(t) =>
                  setForm({ ...form, password: t })
                }
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Phone"
                value={form.phone}
                onChangeText={(t) =>
                  setForm({ ...form, phone: t })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="City"
                value={form.city}
                onChangeText={(t) =>
                  setForm({ ...form, city: t })
                }
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>Add Admin</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
    />
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  form: {
    marginBottom: 20,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: "#6c3483",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  email: {
    color: Colors.softPurple,
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  height:36,
  },
});
