import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const API_ADDRESS = "http://10.0.2.2:5000";

const AddUnavailableDateModal = ({ visible, onClose, UnavailableDate }) => {
  const [showCalender, setShowCalender] = useState(false);
  const [selectedDate, setSelectedDate] = useState(" mm/dd/yyyy");
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Unavailable Date</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#5e2671ff" />
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 19,
              color: "#741f6bff",
              fontWeight: "500",
              textShadowColor: "rgba(106, 8, 117, 0.3)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Date :
          </Text>
          <Pressable onPress={() => setShowCalender(true)}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#e2cee9ff",
                borderRadius: 10,
                padding: 10,
                marginBottom: 30,
              }}
            >
              <Text
                style={{ fontSize: 20, color: "#61235aff", fontWeight: "500" }}
              >
                {selectedDate}
              </Text>
              <Entypo name="calendar" size={24} color="#7b3685ff" />
            </View>
          </Pressable>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showCalender}
            onRequestClose={() => setShowCalender(false)}
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
                  <Text style={styles.titleCalender}>Calender</Text>
                  <Pressable
                    onPress={() => setShowCalender(false)}
                    style={styles.cancle}
                  >
                    <MaterialIcons name="clear" size={30} color="#601d77ff" />
                  </Pressable>
                </View>
                <Calendar
                  minDate={new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setShowCalender(false);
                  }}
                  markedDates={{
                    ...UnavailableDate,
                    [selectedDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      marked: true,
                      selectedColor: "red",
                    },
                  }}
                />
              </View>
            </View>
          </Modal>

          <Text
            style={{
              fontSize: 19,
              color: "#741f6bff",
              fontWeight: "500",
              textShadowColor: "rgba(106, 8, 117, 0.3)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Notes :
          </Text>
          <TextInput
            placeholder="Why You Are Not Available?"
            style={[
              styles.input,
              {
                height: 50,
                backgroundColor: "#e2cee9ff",
                borderRadius: 10,
                padding: 10,
              },
            ]}
            onChangeText={(text) => {}}
            multiline
          />

          <Pressable
            style={styles.saveBtn}
            onPress={() => {
              console.log(UnavailableDate);
            }}
          >
            <Text style={styles.saveBtnText}>Add Date</Text>
          </Pressable>

          <Pressable
            style={styles.cancelBtn}
            onPress={() => {
              onClose();
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddUnavailableDateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fbf0fbff",
    width: "90%",
    height: "70%",
    borderRadius: 15,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 0.7,
    borderBottomColor: "#cfcfcfff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8b1e99ff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 20,
    color: "#490245ff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#7e4391ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700" },
  cancelBtn: {
    backgroundColor: "#f1e4f5",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    alignItems: "center",
  },
  cancelBtnText: { color: "#601d77ff", fontWeight: "700" },

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
  titleCalender: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    paddingLeft: 50,
  },
});
