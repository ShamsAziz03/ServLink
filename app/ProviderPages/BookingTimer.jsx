import React, { useContext, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

export default function BookingTimer() {
  const { currentBooking, timerState, setTimerState } = useContext(AppContext);
  const router = useRouter();
  const timerRef = useRef(null);
    const ip = process.env.EXPO_PUBLIC_IP;

  if (!currentBooking) return <Text>No booking selected</Text>;
  const { booking_id } = currentBooking;

  const startOrResume = () => {
    if (timerState.running) return;
    setTimerState({ ...timerState, running: true });
    timerRef.current = setInterval(() => {
      setTimerState(prev => ({ ...prev, seconds: prev.seconds + 1 }));
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setTimerState(prev => ({ ...prev, running: false }));
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerState({ seconds: 0, running: false });
  };

  const endTimer = async () => {
  pauseTimer();
  const hoursDecimal = (timerState.seconds / 3600).toFixed(2);

  try {
    const res = await axios.put(
      `http://${ip}:5000/api/provider/bookings/booking/${booking_id}/complete`,
      { actual_time: hoursDecimal }
    );

    const { actual_total_price, hourly_rate, user_id } = res.data;
    await fetch(`http://${ip}:5000/api/users/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentBooking.user_id,
        title: 'Booking Completed',
        message:
          `Service finished ✅\n` +
          `Duration: ${hoursDecimal} hours\n` +
          `Total price: ${actual_total_price} ₪`
      })
    });
    console.log(currentBooking.user_id,);
    alert(
      `Booking completed ✅\n` +
      `Duration: ${hoursDecimal} hours\n` +
      `Hourly rate: ${hourly_rate} ₪\n` +
      `Total price: ${actual_total_price} ₪`
    );

    resetTimer();
    router.back();
  } catch (err) {
    console.log(err);
    alert("Error saving time");
  }
};


  const hours = Math.floor(timerState.seconds / 3600);
  const minutes = Math.floor((timerState.seconds % 3600) / 60);
  const seconds = timerState.seconds % 60;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => { pauseTimer(); router.back(); }}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Timer Display */}
      <Text style={styles.time}>
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </Text>

      {/* Buttons Row */}
      <View style={styles.buttonsRow}>
        {!timerState.running ? (
          <TouchableOpacity style={[styles.button, { backgroundColor: "#27ae60" }]} onPress={startOrResume}>
            <FontAwesome name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>{timerState.seconds === 0 ? "Start" : "Resume"}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, { backgroundColor: "#f39c12" }]} onPress={pauseTimer}>
            <FontAwesome name="pause" size={24} color="#fff" />
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: "#c0392b" }]} onPress={resetTimer}>
          <FontAwesome name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* End Button */}
      <TouchableOpacity style={[styles.endButton]} onPress={endTimer}>
        <FontAwesome name="check" size={24} color="#fff" />
        <Text style={styles.buttonText}>End & Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#f0e6fa", padding: 20,
  },
  time: {
    fontSize: 72, fontWeight: "bold", marginBottom: 40,
    color: "#6c3483", fontFamily: "Courier",
  },
  backBtn: {
    position: "absolute", top: 50, left: 20,
    padding: 10, backgroundColor: "#8e44ad",
    borderRadius: 30, elevation: 3,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 8,
  },
  endButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27ae60",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
});
