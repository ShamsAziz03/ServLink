import { React, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Checkbox } from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import AddUnavailableDateModal from "./addUnavailableDate";
import { AppContext } from "../../context/AppContext";

const ProviderScheduleUnavailableDates = () => {
  const API_ADDRESS = "http://10.0.2.2:5000";

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useState("Week Work Schedule");
  const [activePicker, setActivePicker] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { loggedUser } = useContext(AppContext);

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [schedule, setSchedule] = useState({
    sunday: { start: "08:00", end: "09:00" },
    monday: { start: "08:00", end: "10:00" },
    tuesday: { start: "10:00", end: "09:00" },
    wednesday: { start: "08:00", end: "09:00" },
    thursday: { start: "08:00", end: "09:00" },
    friday: { start: "08:00", end: "12:00" },
    saturday: { start: "12:00", end: "09:00" },
  });
  const [selectedDays, setSelectedDays] = useState(["sunday"]);

  const [unavailableDates, setUnavailableDates] = useState([]);
  const [marked, setMarked] = useState({});

  const stats = [
    {
      title: "Work days/Week",
      value: Object.keys(schedule).length,
      icon: "calendar-alt",
      color: "#2a41d8ff",
    },
    {
      title: "Work Hours/Week",
      //   value: providerStats.numOfCompletedOrders,
      value: Object.values(schedule).reduce((total, day) => {
        const s = parseInt(day.start);
        const e = parseInt(day.end);
        return total + Math.max(e - s, 0);
      }, 0),
      icon: "clock",
      color: "#059134ff",
    },
    {
      title: "Unavailable Days",
      value: unavailableDates.length,
      icon: "exclamation-circle",
      color: "#f50b0bff",
    },
  ];

  const fetchSchedule = async () => {
    try {
      const userId = loggedUser.user_id ? loggedUser.user_id : 1;
      const response = await fetch(
        `${API_ADDRESS}/providerScheduleUnavailableDates/getProviderSchedule/${userId}`
      );
      const fetchedData = await response.json();
      let obj = {};
      fetchedData.forEach((data) => {
        obj = {
          ...obj,
          [data.day_of_week]: {
            start: data.start_time.slice(0, 5),
            end: data.end_time.slice(0, 5),
          },
        };
      });
      setSchedule(obj);

      const days = fetchedData.map((d) => d.day_of_week);
      setSelectedDays(days);
    } catch (error) {
      console.error(error.massege);
    }
  };

  const fetchUnavailableDates = async () => {
    try {
      const userId = loggedUser.user_id ? loggedUser.user_id : 1;
      const response = await fetch(
        `${API_ADDRESS}/providerScheduleUnavailableDates/getProviderUnavailableDates/${userId}`
      );
      const fetchedData = await response.json();
      setUnavailableDates(fetchedData);
    } catch (error) {
      console.error(error.massege);
    }
  };
  //to toggle day on select from check box
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      const newSelectedDays = selectedDays.filter((d) => d !== day);
      setSelectedDays(newSelectedDays);
      if (schedule[day]) {
        let obj = schedule;
        delete obj[day];
        setSchedule(obj);
      }
    } else {
      setSelectedDays((prev) => [...prev, day]);
      if (!schedule[day]) {
        setSchedule({
          ...schedule,
          [day]: { start: "00:00", end: "00:00" },
        });
      }
    }
  };

  const updateUnavailableDates = async () => {
    try {
      const userId = loggedUser.user_id ? loggedUser.user_id : 1;
      const response = await fetch(
        `${API_ADDRESS}/providerScheduleUnavailableDates/updateProviderUnavailableDates`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, incomingDates: unavailableDates }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.success);
        fetchUnavailableDates();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error.massege);
    }
  };

  const updateSchedule = async () => {
    try {
      const userId = loggedUser.user_id ? loggedUser.user_id : 1;
      const response = await fetch(
        `${API_ADDRESS}/providerScheduleUnavailableDates/updateProviderSchedule`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, incomingSchedule: schedule }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.success);
        fetchSchedule();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error.massege);
    }
  };

  const saveChangesSchedule = () => {
    console.log("new schedule:*************************", schedule);
    updateSchedule();
  };

  const saveChangesUnavailableDates = () => {
    console.log("new Unavailable Dates:****************", unavailableDates);
    updateUnavailableDates();
  };

  const handleDeleteUnavailableDate = (id) => {
    const arr = unavailableDates.filter((d) => d.id != id);
    setUnavailableDates(arr);
  };

  const setPageContent = () => {
    if (selectedChoice === "Week Work Schedule") {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 10,
              marginVertical: 10,
            }}
          >
            <FontAwesome5 name="clock" size={24} color="#45085cff" />
            <Text
              style={{ color: "#7b3685ff", fontWeight: "700", fontSize: 17 }}
            >
              Work Schedule Of Week
            </Text>
          </View>

          {/* for check days */}
          <View
            style={{
              flexDirection: "cloumn",
              gap: 15,
            }}
          >
            {daysOfWeek.map((day) => (
              <View
                key={day}
                style={{
                  flexDirection: "column",
                  paddingHorizontal: 15,
                  borderRadius: 15,
                  backgroundColor: selectedDays.includes(day)
                    ? "#700578ff"
                    : "#fef0ffd9",
                  justifyContent: "space-between",
                  gap: 10,
                  paddingVertical: 7,
                  borderWidth: 0.5,
                }}
              >
                {/* view of check box and day */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <Checkbox
                    value={selectedDays.includes(day)}
                    onValueChange={() => toggleDay(day)}
                    color={selectedDays.includes(day) ? "#a37cacff" : undefined}
                  />
                  <Text
                    style={{
                      color: selectedDays.includes(day)
                        ? "#f8f3f9ff"
                        : "#40024cff",
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    {day}
                  </Text>
                </View>
                {/* view of start and end time */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "900",
                        color: selectedDays.includes(day)
                          ? "#f8f3f9ff"
                          : "#40024cff",
                        marginTop: 5,
                      }}
                    >
                      Start Hour:
                    </Text>
                    <Pressable
                      onPress={() => {
                        const obj = { day: day, type: "start" };
                        setActivePicker(obj);
                      }}
                    >
                      <Text
                        style={[
                          styles.input,
                          {
                            color: selectedDays.includes(day)
                              ? "#f8f3f9ff"
                              : "#40024cff",
                          },
                        ]}
                      >
                        {schedule[day] ? schedule[day].start : "00:00"}
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "900",
                        color: selectedDays.includes(day)
                          ? "#f8f3f9ff"
                          : "#40024cff",
                        marginTop: 5,
                      }}
                    >
                      End Hour:
                    </Text>
                    <Pressable
                      onPress={() => {
                        const obj = { day: day, type: "end" };
                        setActivePicker(obj);
                      }}
                    >
                      <Text
                        style={[
                          styles.input,
                          {
                            color: selectedDays.includes(day)
                              ? "#f8f3f9ff"
                              : "#40024cff",
                          },
                        ]}
                      >
                        {schedule[day] ? schedule[day].end : "00:00"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            {activePicker && (
              <DateTimePicker
                value={new Date()}
                mode={"time"}
                display="default"
                is24Hour={true}
                onChange={(event, date) => {
                  if (event.type === "dismissed") {
                    setActivePicker(null);
                    return;
                  }

                  if (date) {
                    const h = date.getHours().toString().padStart(2, "0");
                    const m = date.getMinutes().toString().padStart(2, "0");
                    const selectedTime = `${h}:${m}`;
                    setSchedule((prev) => ({
                      ...prev,
                      [activePicker.day]: {
                        ...prev[activePicker.day],
                        [activePicker.type]: selectedTime,
                      },
                    }));
                  }

                  setActivePicker(null);
                }}
              />
            )}
          </View>
          <Pressable
            style={{
              marginTop: 20,
              backgroundColor: "#700578ff",
              padding: 10,
              borderRadius: 10,
              width: "35%",
              alignSelf: "center",
            }}
            onPress={() => saveChangesSchedule()}
          >
            <Text
              style={{
                color: "#e4e0e6ff",
                fontSize: 15,
                fontWeight: "900",
              }}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
      );
    } else if (selectedChoice === "Unavailable Dates") {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 10,
          }}
        >
          {/* to add new date */}
          <Pressable
            style={{
              borderRadius: 10,
              backgroundColor: "#750d83ff",
              width: "50%",
              alignSelf: "flex-end",
            }}
            onPress={() => setShowAddForm(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginHorizontal: 15,
                gap: 5,
                padding: 5,
              }}
            >
              <Ionicons name="add-outline" size={25} color="#fff8f8ff" />
              <Text
                style={{
                  color: "#e4e0e6ff",
                  fontSize: 13,
                  fontWeight: "700",
                  paddingTop: 3,
                }}
              >
                Add Unavailable date
              </Text>
            </View>
          </Pressable>
          {/* to show dates */}
          {/* title */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Entypo name="calendar" size={24} color="#7b3685ff" />
            <Text
              style={{ color: "#7b3685ff", fontWeight: "900", fontSize: 18 }}
            >
              Unavailable Dates
            </Text>
          </View>
          {/* days */}
          <View style={{ gap: 10, marginBottom: 10 }}>
            {unavailableDates.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderWidth: 0.3,
                  borderRadius: 12,
                  backgroundColor: "#fdefffff",
                }}
              >
                {/* Left content */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      padding: 8,
                      borderRadius: 10,
                    }}
                  >
                    <Ionicons name="calendar" size={25} color="#730575ff" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#4f0351ff",
                      }}
                    >
                      {new Date(item.date + "T00:00:00Z").toLocaleDateString(
                        "EG-EG",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#4b5563",
                        marginTop: 4,
                        fontWeight: "400",
                      }}
                    >
                      Added At: {item.created_at}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: "#4d1665ff",
                        marginTop: 4,
                        fontWeight: "400",
                      }}
                    >
                      {item.note}
                    </Text>
                  </View>
                </View>

                {/* Delete button */}
                <Pressable
                  onPress={() => handleDeleteUnavailableDate(item.id)}
                  style={({ pressed }) => ({
                    padding: 6,
                    borderRadius: 8,
                    backgroundColor: pressed ? "#e7c1e9ff" : "transparent",
                  })}
                >
                  <Ionicons name="trash" size={22} color="#51025dff" />
                </Pressable>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 40, marginTop: 15 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "red",
                  borderRadius: 3,
                }}
              />
              <Text
                style={{
                  color: "#490841ff",
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                Unavailable
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 3,
                }}
              />
              <Text
                style={{
                  color: "#490841ff",
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                Available
              </Text>
            </View>
          </View>
          <Calendar
            minDate={new Date().toISOString().split("T")[0]}
            markedDates={marked}
          />
          <AddUnavailableDateModal
            visible={showAddForm}
            onClose={() => setShowAddForm(false)}
            UnavailableDate={marked}
            setUnavailableDates={(newDate) => {
              const arr = unavailableDates.map((item) => item.id);
              const maxId = Math.max(...arr) + 1;
              const obj = {
                id: maxId,
                ...newDate,
              };
              setUnavailableDates([...unavailableDates, obj]);
            }}
          />
          <Pressable
            style={{
              marginTop: 10,
              backgroundColor: "#700578ff",
              padding: 10,
              borderRadius: 10,
              width: "35%",
              alignSelf: "center",
            }}
            onPress={() => saveChangesUnavailableDates()}
          >
            <Text
              style={{
                color: "#e4e0e6ff",
                fontSize: 15,
                fontWeight: "900",
              }}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchUnavailableDates();
  }, []);

  useEffect(() => {
    // for marked dates
    let obj = {};
    unavailableDates.forEach((data) => {
      obj = {
        ...obj,
        [data.date]: {
          dotColor: "black",
          selected: true,
          marked: true,
          selectedColor: "red",
        },
      };
    });
    setMarked(obj);
  }, [unavailableDates]);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 30,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                router.push("/ProviderPages/profileUser");
              }}
            >
              <Ionicons name="arrow-back" size={30} color="#601d77ff" />
            </Pressable>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "900",
                color: "#601d77ff",
              }}
            >
              ServLink
            </Text>
          </View>

          {/* Header */}
          <Text style={styles.title}>Work Schedule</Text>
          <Text style={styles.subtitle}>
            Manage Work Time & Schedule & Unavailable dates
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 5,
                    paddingVertical: 10,
                    marginRight: 10,
                  }}
                >
                  <FontAwesome5 name={item.icon} size={22} color={item.color} />
                  <Text style={styles.statTitle}>{item.title}</Text>
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* for choose option */}
          {
            <View
              style={[
                styles.statsRow,
                {
                  marginTop: 10,
                  marginBottom: 22,
                  backgroundColor: "#e4d0e4ff",
                  borderRadius: 17,
                  overflow: "hidden",
                  borderWidth: 0.7,
                },
              ]}
            >
              <Pressable
                style={{
                  padding: 12,
                  backgroundColor:
                    selectedChoice === "Week Work Schedule"
                      ? "#700578ff"
                      : "#fff3ffff",
                  paddingHorizontal: 20,
                }}
                onPress={() => setSelectedChoice("Week Work Schedule")}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "900",
                    color:
                      selectedChoice === "Week Work Schedule"
                        ? "#ffffffff"
                        : "#3b0242ff",
                  }}
                >
                  Week Work Schedule
                </Text>
              </Pressable>
              <Pressable
                style={{
                  padding: 12,
                  backgroundColor:
                    selectedChoice === "Unavailable Dates"
                      ? "#700578ff"
                      : "#fff3ffff",
                  paddingHorizontal: 20,
                }}
                onPress={() => setSelectedChoice("Unavailable Dates")}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "900",
                    color:
                      selectedChoice === "Unavailable Dates"
                        ? "#ffffffff"
                        : "#3b0242ff",
                  }}
                >
                  Unavailable Dates
                </Text>
              </Pressable>
            </View>
          }

          {/* change the content depends on if stmt */}
          <View>{setPageContent()}</View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default ProviderScheduleUnavailableDates;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#601d77ff",
    marginTop: 25,
  },
  subtitle: {
    color: "#7b3685ff",
    marginBottom: 20,
    fontWeight: "700",
    marginTop: 10,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "32%",
    backgroundColor: "#fdf1ffff",
    padding: 5,
    borderRadius: 15,
    marginBottom: 12,
  },
  statTitle: {
    color: "#7b3685ff",
    fontWeight: "900",
    fontSize: 13.5,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#3f043bff",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomColor: "#888",
    borderBottomWidth: 0.8,
    gap: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: "#a5a5a5ff",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "900",
    padding: 5,
  },
});
