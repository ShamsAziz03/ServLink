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
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

const BookingConfirmation = ({ visible, onClose, provider }) => {
  const [time, setTime] = useState("2:45:00");
  const [selectedDay, setSelectedDay] = useState(""); //for calender
  const [showClock, setShowClock] = useState(false); //for calender
  const [range, setRange] = useState({}); //for calender disable dates
  const [providerSchedule, setProviderSchedule] = useState([]);
  const [providerUnavailableDates, setProviderUnavailableDates] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [dateHasBooks, setDateHasBooks] = useState([]); //to check if choosed date from user has bookes for SP
  const { questionsAnswers, setBookingObject, setExplainEstimateTime } =
    useContext(AppContext); //to take how many hours the task will be
  const [day, setDay] = useState(""); //when user set date so we split day to see day schedule
  const navigation = useNavigation();

  const { provider_id, base_price, service_id } = provider;

  const ip = process.env.EXPO_PUBLIC_IP;

  const fetchServiceProviderSchedule = async () => {
    try {
      const response = await fetch(
        `http://${ip}:5000/bookingService/getServiceProviderSchedule/${provider_id}`
      );
      const fetchedData = await response.json();
      setProviderSchedule(fetchedData);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const fetchServiceProviderBookings = async () => {
    try {
      const response = await fetch(
        `http://${ip}:5000/bookingService/getServiceProviderBookings/${provider_id}`
      );
      const fetchedData = await response.json();
      setProviderBookings(fetchedData);
      console.log("Prov books: ", providerBookings);
    } catch (error) {
      console.error("Error fetching bookings of the SP:", error);
    }
  };

  const fetchServiceProviderUnavailableDates = async () => {
    try {
      const response = await fetch(
        `http://${ip}:5000/bookingService/getServiceProviderUnavailableDates/${provider_id}`
      );
      const fetchedData = await response.json();
      setProviderUnavailableDates(fetchedData);
      console.log("un ava dates are:", fetchedData);
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchServiceProviderSchedule();
      await fetchServiceProviderBookings();
      await fetchServiceProviderUnavailableDates();
    };
    fetchAll();
  }, [provider_id]);

  useEffect(() => {
    if (!providerUnavailableDates) return;

    const r = {};
    providerUnavailableDates.forEach((unAvailableDate) => {
      const unAvaDate = unAvailableDate.date.split("T")[0];
      r[unAvaDate] = { disabled: true, disableTouchEvent: true };
    });
    setRange(r);
  }, [providerUnavailableDates]);

  const getTaskDuration = async () => {
    // for (const questionText in questionsAnswers) {
    //   const answer = questionsAnswers[questionText];
    //   if (!answer) continue;
    //   const v = answer.toString().trim().toLowerCase();
    //   if (questionText.toLowerCase().includes("big")) {
    //     const m = v.match(/(\d+)/);
    //     if (m) {
    //       setBookingObject((prev) => ({
    //         ...prev,
    //         expectedTime: parseInt(m[1], 10),
    //       }));
    //     }
    //   }

    //   if (questionText.toLowerCase().includes("hours")) {
    //     if (/^\d+$/.test(v)) {
    //       setBookingObject((prev) => ({
    //         ...prev,
    //         expectedTime: parseInt(v, 10),
    //       }));
    //       return parseInt(v, 10) * 60;
    //     }
    //     if (v.includes("Full day")) {
    //       setBookingObject((prev) => ({
    //         ...prev,
    //         expectedTime: 8,
    //       }));
    //     }
    //     if (v.includes("Live-in")) {
    //       setBookingObject((prev) => ({
    //         ...prev,
    //         expectedTime: 24,
    //       }));
    //     }
    //   }
    // }
    // return;

    try {
      const response = await fetch(
        `http://${ip}:5000/bookingService/getEstimatedTimeBook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionsAnswers, service_id }),
        }
      );
      const fetchedData = await response.json();
      console.log(
        "Data from AI for estimate time: " + JSON.stringify(fetchedData)
      );
      setExplainEstimateTime(fetchedData.explanation);

      setBookingObject((prev) => ({
        ...prev,
        providerId: provider_id,
        hourlyRate: base_price,
        serviceDate: selectedDay,
        serviceTime: time,
        expectedTime: fetchedData.estimated_time,
      }));
      navigation.navigate("payment");
    } catch (error) {
      console.error("Error fetching bookings of the SP:", error);
    }
  };

  const toMinutes = (t) => {
    const [h, m, s] = t.split(":").map(Number);
    return h * 60 + m + Math.floor(s / 60);
  };

  const decimalHoursToMinutes = (hours) => {
    return Math.round(hours * 60);
  };

  const handlePayment = () => {
    getTaskDuration();
  };

  const minutesToTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

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
            minDate={new Date().toISOString().split("T")[0]}
            onDayPress={(day) => {
              //to check that day is on SP schedule
              const date = new Date(day.dateString);
              const weekdays = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
              ];
              const weekday = weekdays[date.getDay()];
              let exist = 0;
              if (providerSchedule.error) {
                //SP still not add his schedule
                // alert(
                //   "Can't Choose this day, because provider can't do task on this day!"
                // );
                //do nothing
                return;
              }
              providerSchedule.forEach((ps) => {
                if (ps.day_of_week === weekday) {
                  exist = 1;
                  setDay(weekday);
                }
              });
              if (exist == 0) {
                alert(
                  "Can't Choose this day, because provider can't do task on this day!"
                );
                return;
              }

              //to check if date choosed from user has books for SP
              if (providerBookings === null) return;
              let booksDates = [];
              providerBookings.forEach((pb) => {
                let serviceDate = pb.service_date.split("T")[0];
                if (serviceDate === day.dateString) {
                  booksDates.push(pb);
                }
              });
              setDateHasBooks(booksDates);

              setSelectedDay(day.dateString);
            }}
            markedDates={{
              [selectedDay]: {
                selected: true,
                disableTouchEvent: true,
              },
              ...range,
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
              is24Hour={true}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  let h = selectedDate.getHours();
                  let m = selectedDate.getMinutes();
                  let s = selectedDate.getSeconds();
                  h = h.toString().padStart(2, "0");
                  m = m.toString().padStart(2, "0");
                  s = s.toString().padStart(2, "0");

                  let selectedTime = `${h}:${m}:${s}`;
                  //to check if time selected is in work time range of SP
                  if (providerSchedule.error) return;
                  let exist = 0;
                  providerSchedule.forEach((ps) => {
                    if (
                      day == ps.day_of_week &&
                      selectedTime >= ps.start_time &&
                      selectedTime <= ps.end_time
                    )
                      exist = 1;
                  });
                  if (exist == 0) {
                    alert(
                      "Can't Choose this time, because this time is out of work time range of sp!"
                    );
                    setShowClock(false);
                    return;
                  }
                  //to check if time selected is not on range that sp has sth booked
                  if (dateHasBooks.length !== 0) {
                    const selectedMins = toMinutes(selectedTime);

                    for (const db of dateHasBooks) {
                      const bookedStart = toMinutes(db.service_time) - 60; // 1 hour before, cause SP can't do task since next book has 1 hour
                      const bookedEnd =
                        toMinutes(db.service_time) +
                        decimalHoursToMinutes(db.estimated_time) +
                        30; // 30 min after

                      if (
                        selectedMins >= bookedStart &&
                        selectedMins <= bookedEnd
                      ) {
                        const endTimeStr = minutesToTime(bookedEnd);
                        alert(
                          `Provider has a booking at this time!\nChoose Time after: ${endTimeStr}`
                        );
                        setShowClock(false);
                        return;
                      }
                    }
                  }

                  setTime(selectedTime);
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
            You can adjust task details or change start time after confirming.
          </Text>
          <Pressable
            onPress={() => {
              handlePayment();
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
