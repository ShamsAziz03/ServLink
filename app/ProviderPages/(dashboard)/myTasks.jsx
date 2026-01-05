import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { AppContext } from "../../../context/AppContext";
const COLORS = {
  background: "#f6f0fa",
  calendarBg: "#efe4f7",
  primary: "#8e44ad",
  primaryDark: "#6c3483",
  textMuted: "#8e7aa8",
  cardBg: "#ffffff",
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookingCalendarScreen() {
  const today = new Date();
  const router = useRouter();
  const { setCurrentBooking } = useContext(AppContext);


  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const ip = process.env.EXPO_PUBLIC_IP;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const provider_id = user.provider_id;

      if (!provider_id) {
        console.log("No provider_id found");
        return;
      }

      const res = await axios.get(
        `http://${ip}:5000/api/provider/bookings/${provider_id}`
      );
      // console.log(res);

      setAppointments(res.data);
    } catch (err) {
      console.log("API ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

 useFocusEffect(
  useCallback(() => {
    fetchBookings();
  }, [])
);

  /* ================= FILTER BY DATE ================= */
  const filteredAppointments = appointments.filter((a) => {
    const d = new Date(a.service_date);
    return (
      d.getDate() === selectedDay &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      {/* ===== Calendar Header ===== */}
      <View style={styles.calendarWrapper}>
        {/* Month & Year Pickers */}
        <View style={styles.pickersRow}>
          <Picker
            selectedValue={currentMonth}
            style={styles.monthPicker}
            onValueChange={(value) => {
              setCurrentMonth(value);
              setSelectedDay(1);
            }}
          >
            {monthNames.map((m, i) => (
              <Picker.Item key={i} label={m} value={i} />
            ))}
          </Picker>

          <Picker
            selectedValue={currentYear}
            style={styles.yearPicker}
            onValueChange={(value) => {
              setCurrentYear(value);
              setSelectedDay(1);
            }}
          >
            {[2024, 2025, 2026].map((y) => (
              <Picker.Item key={y} label={`${y}`} value={y} />
            ))}
          </Picker>
        </View>

        {/* Week Days */}
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => (
            <Text key={i} style={styles.weekDay}>{d}</Text>
          ))}
        </View>

        {/* Days */}
        <View style={styles.daysGrid}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const active = day === selectedDay;
            return (
              <TouchableOpacity
                key={day}
                style={styles.dayCell}
                onPress={() => setSelectedDay(day)}
              >
                <View style={[styles.dayCircle, active && styles.activeDay]}>
                  <Text style={[styles.dayText, active && styles.activeDayText]}>
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ===== Appointments ===== */}
      <ScrollView contentContainerStyle={styles.appointments}>
        <Text style={styles.sectionTitle}>
          Appointments for {selectedDay} {monthNames[currentMonth]} {currentYear}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : filteredAppointments.length === 0 ? (
          <Text style={styles.empty}>No bookings for this day</Text>
        ) : (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item.booking_id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.time}>{item.service_time}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (item.status !== "Pending") return; 
                    setCurrentBooking(item); 
                    router.push("../BookingTimer"); 
                  }}
                  disabled={item.status !== "Pending"} 
                >
                
                  <View style={styles.card}>
                     <View style={styles.labelRow}>
                      <Text style={styles.labelTitle}>Service:</Text>
                      <Text style={styles.labelText}>{item.name}</Text>
                    </View>
                    <View style={styles.labelRow}>
                      <Text style={styles.labelTitle}>Status:</Text>
                      <Text style={styles.labelText}>{item.status}</Text>
                    </View>
                    <View style={styles.labelRow}>
                      <Feather name="user" size={16} color={COLORS.primary} />
                      <Text style={styles.labelText}>
                        Client: {item.client_name}
                      </Text>
                    </View>

                    <View style={styles.labelRow}>
                      <Feather name="map-pin" size={16} color={COLORS.primary} />
                      <Text style={styles.labelText}> Address: {item.address}</Text>
                    </View>

                    <View style={styles.labelRow}>
                      <Feather name="dollar-sign" size={16} color={COLORS.primary} />
                      <Text style={styles.labelText}>Estimated Price: {item.total_price}</Text>
                    </View>

                    <View style={styles.labelRow}>
                      <Feather name="credit-card" size={16} color={COLORS.primary} />
                      <Text style={styles.labelText}>Payment method: {item.payment_method}</Text>
                    </View>

                    <View style={styles.labelRow}>
                      <Feather name="clock" size={16} color={COLORS.primary} />
                      <Text style={styles.labelText}>Estimated time: {item.estimated_time} hours</Text>
                    </View>


                    {item.notes && (
                      <View style={styles.labelRow}>
                        <Feather name="file-text" size={16} color={COLORS.primary} />
                        <Text style={styles.labelText}>Notes: {item.notes}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

            )}
          />
        )}
      </ScrollView>
    </View >
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  calendarWrapper: {
    backgroundColor: COLORS.calendarBg,
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  pickersRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },

  monthPicker: { width: 160 },
  yearPicker: { width: 120 },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weekDay: {
    width: 32,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },

  daysGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },

  dayCell: { width: "14.2%", alignItems: "center", marginVertical: 4 },

  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  dayText: { fontSize: 12, color: COLORS.primaryDark },
  activeDay: { backgroundColor: COLORS.primary },
  activeDayText: { color: "#fff", fontWeight: "700" },

  appointments: { padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryDark,
    marginBottom: 15,
  },

  empty: { color: COLORS.textMuted },

  row: { flexDirection: "row", marginBottom: 16 },
  time: { width: 70, color: COLORS.textMuted, marginTop: 12 },

  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.primaryDark,
  },

  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  labelTitle: { fontWeight: "600", marginRight: 6 },
  labelText: { color: COLORS.primaryDark, marginLeft: 4 },
});
