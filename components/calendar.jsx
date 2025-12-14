import React, { useEffect, useState, useContext } from "react";
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
import { AppContext } from "../context/AppContext";

const MyCalendar = ({ visible, onClose }) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const [selectedDay, setSelectedDay] = useState(""); //for calender
  const { setChoosedDate } = useContext(AppContext);

  useEffect(() => {
    console.log("day is from my calender page:", selectedDay);
  }, [selectedDay]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlayScreen}>
        <View
          style={[
            styles.calenderView,
            { width: width / 1.2, height: height - 400, marginTop: 200 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 10,
            }}
          >
            <Text style={styles.title}>Calender</Text>
            <Pressable onPress={onClose} style={styles.cancle}>
              <MaterialIcons name="clear" size={30} color="#601d77ff" />
            </Pressable>
          </View>
          <Calendar
            minDate={new Date().toISOString().split("T")[0]}
            onDayPress={(day) => {
              setChoosedDate(day.dateString);
              setSelectedDay(day.dateString);
            }}
            markedDates={{
              [selectedDay]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  overlayScreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  calenderView: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  cancle: { paddingLeft: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    paddingLeft: 50,
  },
});
