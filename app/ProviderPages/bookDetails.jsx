import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const BookDetails = ({ visible, onClose, book }) => {
  const [answers, setAnswers] = useState([]);

  const API_ADDRESS = "http://10.0.2.2:5000";

  const fetchAnswers = async () => {
    try {
      const bookId = book?.booking_id || 1;
      const result = await fetch(
        `${API_ADDRESS}/providerBookings/getBookAnswers/${bookId}`
      );
      const fetchedData = await result.json();
      setAnswers(fetchedData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [visible]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Booking Details</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={26} color="#601d77" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Service + Status Badge */}
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={styles.sectionTitle}>{book?.serviceName}</Text>
                  <Text style={styles.subText}>{book?.categoryName}</Text>
                </View>
                <View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{book?.status}</Text>
                  </View>
                  <View style={styles.status}>
                    <Text style={styles.statusText}>
                      {book?.is_accept === "pending"
                        ? "Undecided"
                        : book?.is_accept}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Customer / Phone / Date/Time / Estimated / Duration */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Specific Info</Text>
              {/* Row 1: User + Phone */}
              <View style={styles.rowSplit}>
                <View style={styles.infoRow}>
                  <FontAwesome name="user" size={18} color="#5a0667" />
                  <Text style={styles.value}>
                    {book?.first_name} {book?.last_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={18} color="#5a0667" />
                  <Text style={styles.value}>{book?.phone}</Text>
                </View>
              </View>

              {/* Row 2: duration + Estimated */}
              <View style={styles.rowSplit}>
                <View style={styles.infoRow}>
                  <Ionicons name="timer" size={18} color="#5a0667" />
                  <Text style={styles.value}>
                    Estimated: {book?.estimated_time || "--"} hr
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="stopwatch" size={18} color="#5a0667" />
                  <Text style={styles.value}>
                    Duration: {book?.duration_time || "--"} hr
                  </Text>
                </View>
              </View>

              {/* Row 3: date and time */}

              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={18} color="#5a0667" />
                <Text style={styles.value}>
                  {"Date And Time:  " + book?.service_date.split("T")[0]} ,
                  {book?.service_time}
                </Text>
              </View>
            </View>
            {/* Location */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location-sharp" size={18} color="#5a0667" />
                <Text style={styles.value}>{book?.address}</Text>
              </View>
            </View>

            {/* Task Details / Questions */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Task Details</Text>
              {answers.length > 1 ? (
                answers.map((item, index) => (
                  <View key={index} style={styles.qaBox}>
                    <Text style={styles.question}>{item.question_id}</Text>
                    <Text style={styles.answer}>→ {item.answer_value}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.qaBox}>
                  <Text style={styles.question}>No Question had answered</Text>
                </View>
              )}
            </View>

            {/* Notes */}
            {book?.notes && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.note}>{book?.notes}</Text>
              </View>
            )}

            {/* Price */}
            <View
              style={[
                styles.card,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <View>
                <Text style={styles.sectionTitle}>Total Price</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 30,
                  }}
                >
                  <Text style={styles.price}>
                    {book?.actual_total_price === null
                      ? book?.total_price
                      : book?.actual_total_price}
                    ₪
                  </Text>
                  <Text style={styles.label}>
                    {"(" + book?.payment_method + ")"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "92%",
    height: "90%",
    backgroundColor: "#d6bfddff",
    borderRadius: 16,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e4c1ea",
    marginBottom: 10,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#601d77",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5a0667",
    marginBottom: 4,
  },

  subText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#705276",
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c5186ff",
    marginTop: 8,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 6,
  },

  qaBox: {
    backgroundColor: "#f3e9f7",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  question: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b1458",
  },

  answer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },

  note: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    lineHeight: 18,
    padding: 6,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeeba",
  },

  badge: {
    backgroundColor: "#e4c1ea",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 5,
  },
  status: {
    backgroundColor: "#6e147eff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 5,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5a0667",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f1e4f3ff",
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#228B22",
    marginTop: 4,
  },

  rowSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
});