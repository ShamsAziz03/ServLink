import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; 

const COLORS = {
  background: "#f6f0fa",
  calendarBg: "#efe4f7",
  primary: "#8e44ad",
  primaryDark: "#6c3483",
  textMuted: "#8e7aa8",
  cardBg: "#ffffff",
  border: "#e2d6ef",
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

export default function BookingCalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(9);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      status: "Confirmed",
      time: "09:00 AM",
      duration: "45 min",
      address: "123 Main St",
      title: "Haircut Appointment",
      price: "$30",
      paymentMethod: "Cash",
      notes: "Bring own comb",
    },
    {
      id: 2,
      status: "Pending",
      time: "11:30 AM",
      duration: "1 hour",
      address: "Beauty Salon, 45 Elm St",
      title: "Makeup Session",
      price: "$50",
      paymentMethod: "Credit Card",
      notes: "No special notes",
    },
    {
      id: 3,
      status: "Confirmed",
      time: "02:00 PM",
      duration: "1 hour",
      address: "Spa Center, 78 Oak St",
      title: "Massage Therapy",
      price: "$70",
      paymentMethod: "Cash",
      notes: "Bring towel",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <View style={styles.container}>
      {/* 📆 Calendar */}
      <View style={styles.calendarWrapper}>
        <Text style={styles.month}>January 2025</Text>

        <View style={styles.weekRow}>
          {weekDays.map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {daysInMonth.map((day) => {
            const active = day === selectedDay;
            return (
              <TouchableOpacity
                key={day}
                style={styles.dayCell}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.dayCircle, active && styles.activeDay]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      active && styles.activeDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 📋 Appointments */}
      <ScrollView
        contentContainerStyle={styles.appointments}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          Appointments for Day {selectedDay}
        </Text>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            if (!item) return null; // حماية من undefined

            return (
              <View style={styles.row}>
                <Text style={styles.time}>{item.time}</Text>

                <View style={styles.card}>
                  {/* Title */}
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  {/* Status Dropdown */}
                  <View style={styles.labelRow}>
                    <Text style={styles.labelTitle}>Status:</Text>
                    <Picker
                      selectedValue={item?.status}
                      style={styles.picker}
                      onValueChange={(value) => updateStatus(item.id, value)}
                    >
                      <Picker.Item label="Confirmed" value="Confirmed" />
                      <Picker.Item label="Pending" value="Pending" />
                      <Picker.Item label="Cancelled" value="Cancelled" />
                    </Picker>
                  </View>

                  {/* Duration */}
                  <View style={styles.labelRow}>
                    <Feather name="clock" size={16} color={COLORS.primary} />
                    <Text style={styles.labelText}>
                      Duration: {item.duration}
                    </Text>
                  </View>

                  {/* Address */}
                  <View style={styles.labelRow}>
                    <Feather name="map-pin" size={16} color={COLORS.primary} />
                    <Text style={styles.labelText}>
                      Address: {item.address}
                    </Text>
                  </View>

                  {/* Price */}
                  <View style={styles.labelRow}>
                    <Feather name="dollar-sign" size={16} color={COLORS.primary} />
                    <Text style={styles.labelText}>Price: {item.price}</Text>
                  </View>

                  {/* Payment Method */}
                  <View style={styles.labelRow}>
                    <Feather name="credit-card" size={16} color={COLORS.primary} />
                    <Text style={styles.labelText}>
                      Payment: {item.paymentMethod}
                    </Text>
                  </View>

                  {/* Notes */}
                  <View style={styles.labelRow}>
                    <Feather name="file-text" size={16} color={COLORS.primary} />
                    <Text style={styles.labelText}>Notes: {item.notes}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  /* Calendar */
  calendarWrapper: {
    backgroundColor: COLORS.calendarBg,
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
    elevation: 10,
  },

  month: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 6,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weekDay: {
    width: 32,
    textAlign: "center",
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: 12,
  },

  daysGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },

  dayCell: { width: "14.2%", alignItems: "center", marginVertical: 4 },

  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: "600" },

  activeDay: { backgroundColor: COLORS.primary },
  activeDayText: { color: "#fff", fontWeight: "700" },

  /* Appointments */
  appointments: { padding: 20, paddingTop: 25 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryDark,
    marginBottom: 15,
  },

  row: { flexDirection: "row", marginBottom: 16 },

  time: {
    width: 70,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 12,
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  labelTitle: { fontSize: 13, fontWeight: "600", marginRight: 6 },
  labelText: { fontSize: 13, color: COLORS.primaryDark, marginLeft: 4 },

  picker: { height: 30, width: 140, color: COLORS.primary },
});
