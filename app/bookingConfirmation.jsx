import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const BookingConfirmation = ({ visible, onClose }) => {
  const [time, setTime] = useState("2:45:00 AM");
  const [selectedDay, setSelectedDay] = useState(""); //for calender
  const [showClock, setShowClock] = useState(false); //for calender

  useEffect(() => {
    console.log("time is:", time);
  }, [time]);

  useEffect(() => {
    console.log("day from booking conf is:", selectedDay);
  }, [selectedDay]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* all over screen */}
      <View style={styles.overlayScreen}>
        {/* booking confirmation screen */}
        <View style={styles.bookingConfirmation}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <Text style={styles.title}>Booking Confirmation</Text>
            <Pressable onPress={onClose} style={styles.cancle}>
              <MaterialIcons name="clear" size={30} color="#601d77ff" />
            </Pressable>
          </View>

          <Calendar
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
            }}
            markedDates={{
              [selectedDay]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
          />
          <Pressable onPress={() => setShowClock(true)}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#f2d3f2ff",
                padding: 10,
                borderRadius: 15,
                justifyContent: "center",
                marginVertical: 7,
                width: "75%",
                marginLeft: 40,
              }}
            >
              <MaterialIcons name="lock-clock" size={30} color="#601d77ff" />
              <Text
                style={{ fontSize: 22, fontWeight: "bold", color: "#3b2d4bff" }}
              >
                {time}
              </Text>
            </View>
          </Pressable>
          {showClock && (
            <DateTimePicker
              value={new Date()}
              mode={"time"}
              display="defualt"
              is24Hour={false}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTime(selectedDate.toLocaleTimeString());
                  setShowClock(false);
                }
              }}
            />
          )}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: "#3b2d4bff",
              paddingTop: 10,
            }}
          >
            Request for:
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "400", color: "#3b2d4bff" }}>
            {selectedDay}, {time}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "450",
              color: "#3b2d4bff",
              paddingTop: 5,
            }}
          >
            You can chat to adjust task details or change start time after
            confirming.
          </Text>
          <Pressable
            onPress={() => {
              console.log(selectedDay + ", " + time);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                backgroundColor: "#efc7efff",
                padding: 10,
                borderRadius: 15,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <MaterialIcons name="book" size={30} color="#601d77ff" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#3b2d4bff",
                  marginTop: 3,
                }}
              >
                Select and Continue
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BookingConfirmation;

const styles = StyleSheet.create({
  overlayScreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    height: "100%",
  },
  bookingConfirmation: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#fcedfdff",
    padding: 15,
    margin: 10,
    borderRadius: 15,
  },
  cancle: { paddingLeft: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    paddingLeft: 50,
  },
});
