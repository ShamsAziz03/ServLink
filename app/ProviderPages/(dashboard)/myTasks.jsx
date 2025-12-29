import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function MyTasks() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [currentRatingBooking, setCurrentRatingBooking] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState("");

  const BASE_URL = "http://10.0.2.2:5000";

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const dateToDays = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return Math.floor(dt.getTime() / (1000 * 60 * 60 * 24));
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const res = await fetch(`${BASE_URL}/api/bookings/user/${user.user_id}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setBookings([]);
        return;
      }

      const filtered = data.filter((b) => {
        const status = b.status.toLowerCase();
        if (filter === "completed") return status === "completed";
        if (filter === "pending") return status === "pending";
        if (filter === "cancelled") return status === "cancelled";
        return true;
      });

      const formattedData = filtered.map((b) => {
        const dateObj = new Date(b.service_date);
        dateObj.setDate(dateObj.getDate() + 1);
        const correctedDate = dateObj.toISOString().slice(0, 10);
        return { ...b, service_date: correctedDate };
      });

      setBookings(formattedData);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (booking_id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${booking_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      Alert.alert("Info", data.message);
      fetchBookings();
    } catch (err) {
      Alert.alert("Error", "Error deleting booking");
    }
  };

  const handleEdit = async () => {
    if (!currentBooking) return;

    const todayDays = dateToDays(new Date().toISOString().substring(0, 10));
    const bookingDays = dateToDays(newDate);

    if (bookingDays - todayDays < 1) {
      Alert.alert(
        "Cannot Edit",
        "Booking must be at least 1 day in the future"
      );
      return;
    }

    let formattedTime = newTime;
    if (formattedTime && formattedTime.length === 5) formattedTime += ":00";

    try {
      const res = await fetch(
        `${BASE_URL}/api/bookings/${currentBooking.booking_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_date: newDate,
            service_time: formattedTime,
            address: newAddress,
            notes: newNotes,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Booking updated successfully");
        setEditModalVisible(false);
        setCurrentBooking(null);
        fetchBookings();
      } else {
        Alert.alert("Error", data.message || "Failed to update booking");
      }
    } catch (err) {
      Alert.alert("Error", "Error updating booking");
    }
  };

  const openEditModal = (booking) => {
    setCurrentBooking(booking);
    setNewDate(booking.service_date);
    setNewTime(booking.service_time);
    setNewAddress(booking.address);
    setNewNotes(booking.notes || "");
    setEditModalVisible(true);
  };

  const openRatingModal = (booking) => {
    setCurrentRatingBooking(booking);
    setRatingScore(0);
    setRatingFeedback("");
    setRatingModalVisible(true);
  };

  const submitRating = async () => {
    if (!currentRatingBooking) return;
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const res = await fetch(`${BASE_URL}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: currentRatingBooking.booking_id,
          score: ratingScore,
          feedback_text: ratingFeedback,
        }),
      });
      console.log("Selected Booking Data:", currentRatingBooking);

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Rating submitted!");
        setRatingModalVisible(false);
        setCurrentRatingBooking(null);
        fetchBookings();
      } else {
        Alert.alert("Error", data.message || "Failed to submit rating");
      }
    } catch (err) {
      Alert.alert("Error", "Error submitting rating");
    }
  };

  const StarRating = ({ rating, onChange }) => (
    <View style={{ flexDirection: "row", marginVertical: 5 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onChange(s)}>
          <MaterialIcons
            name={s <= rating ? "star" : "star-border"}
            size={28}
            color={s <= rating ? "#750d83" : "#ccc"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCard = ({ item }) => (
    <LinearGradient colors={["#ffffff", "#f5f0fa"]} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Booking #{item.booking_id}</Text>
        <MaterialIcons name="event" size={24} color="#750d83" />
      </View>

      {[
        ["info", `Status: ${item.status}`],
        ["date-range", `Date: ${item.service_date}`],
        ["person", `Provider: ${item.provider_name || "N/A"}`],
        ["schedule", `Time: ${item.service_time}`],
        ["payments", `Total: $${item.total_price}`],
        ["credit-card", `Payment: ${item.payment_method}`],
        ["place", `Address: ${item.address}`],
      ].map(([icon, text], idx) => (
        <View key={idx} style={styles.detailRow}>
          <MaterialIcons name={icon} size={16} color="#750d83" />
          <Text style={styles.detailText}>{text}</Text>
        </View>
      ))}

      <View style={styles.actions}>
        <ActionButton
          icon="edit"
          text="Edit"
          color="#8e44ad"
          onPress={() => openEditModal(item)}
        />
        <ActionButton
          icon="delete"
          text="Delete"
          color="#c0392b"
          onPress={() => handleDelete(item.booking_id)}
        />

        {item.status.toLowerCase() === "completed" && (
          <ActionButton
            icon="star"
            text="Rate"
            color="#750d83"
            onPress={() => openRatingModal(item)}
          />
        )}
      </View>
    </LinearGradient>
  );
  const ActionButton = ({ icon, text, color, onPress }) => (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: color }]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={18} color="#fff" />
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <View style={styles.filterRow}>
        {["all", "completed", "pending", "cancelled"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={styles.filterText}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#750d83"
          style={{ marginTop: 50 }}
        />
      ) : bookings.length === 0 ? (
        <Text style={styles.noData}>No bookings found</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.booking_id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Booking</Text>

            <Text style={styles.inputLabel}>Service Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={newDate}
              onChangeText={setNewDate}
            />

            <Text style={styles.inputLabel}>Service Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={newTime}
              onChangeText={setNewTime}
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={newAddress}
              onChangeText={setNewAddress}
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={newNotes}
              onChangeText={setNewNotes}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#750d83" }]}
                onPress={handleEdit}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#dc3545" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Rate Booking #{currentRatingBooking?.booking_id}
            </Text>

            <Text style={styles.inputLabel}>Rating</Text>
            <StarRating rating={ratingScore} onChange={setRatingScore} />

            <Text style={styles.inputLabel}>Feedback</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={ratingFeedback}
              onChangeText={setRatingFeedback}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#750d83" }]}
                onPress={submitRating}
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#dc3545" }]}
                onPress={() => setRatingModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterBtn: {
    backgroundColor: "#d9c7e8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  activeFilter: { backgroundColor: "#750d83" },
  filterText: { color: "#fff", fontWeight: "bold" },
  card: {
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37043a",
    marginBottom: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  detailText: { fontSize: 14, color: "#4b4453", marginLeft: 5 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8e44ad",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  noData: {
    textAlign: "center",
    color: "#750d83",
    fontSize: 16,
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#37043a",
  },
});
