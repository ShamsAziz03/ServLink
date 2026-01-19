import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppContext } from "../../context/AppContext";
import { Picker } from "@react-native-picker/picker";

export default function ProviderRequests() {
  const router = useRouter();
  const ip = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${ip}:5000`;
  const { loggedUser } = useContext(AppContext);

  const [pendingBookings, setPendingBookings] = useState([]);
  const [providerStats, setProviderStats] = useState({
    numOfPendingOrders: 0,
    numOfCancelledOrders: 0,
  });
  const stats = [
    {
      title: "Pending Orders",
      value: providerStats.numOfPendingOrders,
      icon: "clock",
      color: "#ea580c",
    },
    {
      title: "Cancelled Orders",
      value: providerStats.numOfCancelledOrders,
      icon: "times-circle",
      color: "#db3218ff",
    },
  ];
  const cancelReasons = [
    "Unable to proceed due to unforeseen circumstances.",
    "Booking canceled due to a scheduling conflict.",
    "Cannot proceed after acceptance.",
    "Personal emergency.",
    "Service unavailable at this time.",
    "Other",
  ];
  const [cancelReason, setCancelReason] = useState("");
  const [showOther, setShowOther] = useState(false);

  const fetchBooks = async () => {
    const id = loggedUser?.user_id || 2;
    const result = await fetch(
      `${API_ADDRESS}/providerBookings/getProviderPendingAcceptedBookings/${id}`,
    );
    const fetchedData = await result.json();
    setPendingBookings(fetchedData);
  };

  const fetch_pending_cancelled_orders = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderStats/getProviderCancelledPendingOrders/${loggedUser.user_id}`,
      );
      const fetchedData = await response.json();
      setProviderStats((prev) => ({
        ...prev,
        numOfPendingOrders: fetchedData.numOfPendingsOrders,
        numOfCancelledOrders: fetchedData.numOfCancelledOrders,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  // to send noti for user that auto book isn't work so he must do it by himself
  const sendFailureNotificationToUser = async (book) => {
    try {
      const obj = {
        book: book,
        provider: loggedUser,
      };
      const response = await fetch(
        `${API_ADDRESS}/cancelApprovedBookings/sendFailureNotificationToUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        },
      );
      const fetchedData = await response.json();
      if (fetchedData.error) {
        alert(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // for auto booking for user with diff provider using AI
  const automaticBookUsingAI = async (book) => {
    try {
      const obj = { book: book };
      const result = await fetch(
        `${API_ADDRESS}/cancelApprovedBookings/automaticBookUsingAI`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        },
      );

      const response = await result.json();
      if (response.error) {
        // code to send notification for user to do his booking by hand
        alert("System Can't do auto book, " + response.error);
        sendFailureNotificationToUser(book);
      } else if (response.success) {
        alert(response.success);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const addNotification = async (book) => {
    try {
      const obj = {
        book: book,
        provider: loggedUser,
      };
      const response = await fetch(
        `${API_ADDRESS}/cancelApprovedBookings/addNotification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        },
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        alert(fetchedData.success);
        fetchBooks();
        fetch_pending_cancelled_orders();
        automaticBookUsingAI(book);
      } else {
        console.error(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateBookStauts = async (book) => {
    try {
      const obj = {
        booking_id: book.booking_id,
      };
      const response = await fetch(
        `${API_ADDRESS}/cancelApprovedBookings/updateBookStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        },
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        addNotification(book);
      } else {
        console.error(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const cancelApprovedBook = async (book) => {
    try {
      const obj = {
        booking_id: book.booking_id,
        reason: cancelReason,
        provider: loggedUser,
      };
      const response = await fetch(
        `${API_ADDRESS}/cancelApprovedBookings/addNewCancelledBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        },
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        if (fetchedData.blocked)
          alert(
            "Sorry, You had been Blocked for 30 days, since you exceeded max cancelled books!",
          );
        updateBookStauts(book);
      } else {
        console.error(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelBook = (book) => {
    Alert.alert(
      "Cancel Book",
      "Are you sure you want to Reject and Cancel this Book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sure",
          style: "destructive",
          onPress: () => {
            if (cancelReason === "") return;
            else cancelApprovedBook(book);
          },
        },
      ],
    );
  };

  useEffect(() => {
    fetchBooks();
    fetch_pending_cancelled_orders();
  }, []);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, marginBottom: 10, marginTop: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* title of the page*/}
          <View
            style={{
              flexDirection: "row",
              gap: 40,
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <Pressable
              onPress={() => router.push("/ProviderPages/profileUser")}
            >
              <Ionicons name="arrow-back" size={30} color="#601d77ff" />
            </Pressable>
            <Text style={styles.headerText}>Cancel Accepted Bookings</Text>
          </View>

          {/* Header */}
          <View style={styles.container}>
            <View style={styles.header}>
              <Ionicons name="warning-outline" size={27} color="#c62828" />
              <Text style={styles.title}>
                Important Warning: Cancelling bookings affects your reputation!
              </Text>
            </View>

            {/* Points */}
            <View style={styles.points}>
              <Text style={styles.point}>
                • Each cancellation adds a negative record to your account
              </Text>
              <Text style={styles.point}>
                • Repeated cancellations may lead to account Block
              </Text>
            </View>
          </View>

          {/* stats */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }}>
            <Ionicons name="stats-chart" size={24} color="#4c074c" />
            <Text
              style={{
                color: "#59135e",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 10,
              }}
            >
              Statistics
            </Text>
          </View>
          <View style={styles.statsRow}>
            {stats.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 10,
                    marginRight: 30,
                  }}
                >
                  <FontAwesome5 name={item.icon} size={22} color={item.color} />
                  <Text style={styles.statTitle}>{item.title}</Text>
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Booking List */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 5,
              marginTop: 10,
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="#4c074c" />
            <Text
              style={{
                color: "#59135e",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 10,
              }}
            >
              Bookings
            </Text>
          </View>
          {pendingBookings.length ? (
            pendingBookings.map((item) => (
              <View key={item.booking_id} style={styles.card}>
                {/* Created At */}
                <View
                  style={[
                    styles.viewRow,
                    { justifyContent: "space-between", marginBottom: 20 },
                  ]}
                >
                  <Text
                    style={{
                      backgroundColor: "#e37e18",
                      padding: 8,
                      borderRadius: 5,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    {item.status}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <Ionicons
                      name="calendar"
                      size={14}
                      color="#635e64ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.createdAt}>
                      Created At: {item.created_at.split("T")[0]}
                    </Text>
                  </View>
                </View>

                {/* Service Name and Price */}
                <View style={[styles.viewRow, { marginBottom: 15 }]}>
                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="home-repair-service"
                      size={18}
                      color="#5a0667ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                  </View>
                  <Text
                    style={{
                      backgroundColor: "#2da515",
                      padding: 3,
                      borderRadius: 5,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {item.is_accept.toLowerCase() === "pending"
                      ? "Undecided"
                      : item.is_accept.toLowerCase()}
                  </Text>
                </View>

                {/* Category */}
                <View
                  style={[
                    styles.viewRow,
                    {
                      justifyContent: "space-between",
                      gap: 5,
                      marginBottom: 20,
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome
                      name="tags"
                      size={14}
                      color="#8a5994ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.categoryName}>{item.categoryName}</Text>
                  </View>
                  <Text style={styles.price}>
                    {item.actual_total_price === null ||
                    item.actual_total_price == "0.00"
                      ? item.total_price
                      : item.actual_total_price}
                    ₪
                  </Text>
                </View>

                {/* User Name and phone and time*/}
                <View style={styles.viewRow}>
                  <View style={styles.infoRow}>
                    <FontAwesome
                      name="user"
                      size={16}
                      color="#651a71ff"
                      style={{ marginRight: 5 }}
                    />
                    <View style={{ flexDirection: "column", gap: 5 }}>
                      <Text style={styles.userName}>
                        {item.first_name} {item.last_name}
                      </Text>
                      <Text style={styles.generalText}>{item.phone}</Text>
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: "column", gap: 5, width: "70%" }}
                  >
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="location-sharp"
                        size={16}
                        color="#401c47ff"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.generalText}>{item.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="time"
                        size={16}
                        color="#441a41ff"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.generalText}>
                        {item.service_time} | {item.service_date.split("T")[0]}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* why u want to cancle */}
                <Text style={styles.label}>Reason to cancel Book?</Text>
                <Picker
                  onValueChange={(value) => {
                    if (value === "Other") setShowOther(true);
                    else {
                      setCancelReason(value);
                      setShowOther(false);
                    }
                  }}
                >
                  {cancelReasons.length > 0 &&
                    cancelReasons.map((c, i) => (
                      <Picker.Item
                        key={i}
                        label={c}
                        value={c}
                        style={{
                          color: "#220322",
                          fontSize: 14,
                          fontWeight: "900",
                        }}
                      />
                    ))}
                </Picker>
                {showOther && (
                  <TextInput
                    placeholder="Write Your Reason"
                    style={styles.input}
                    onChangeText={(t) => setCancelReason(t)}
                  />
                )}

                {/* cancel button */}
                <Pressable
                  style={{
                    backgroundColor: "#d82626",
                    width: "55%",
                    alignSelf: "center",
                    alignItems: "center",
                    marginTop: 20,
                    borderRadius: 7,
                    padding: 4,
                  }}
                  onPress={() => handleCancelBook(item)}
                >
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <MaterialIcons name="cancel" size={22} color="white" />
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      Cancel Booking
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={50}
                color="#4e0c4cff"
              />
              <Text style={styles.emptyText}>No data to show</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#741f6bff",
    fontWeight: "500",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 20,
    color: "#490245ff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fdf6ffff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  viewRow: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a0667ff",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  price: { fontSize: 18, fontWeight: "700", color: "#4caf50" },
  createdAt: { fontSize: 11, fontWeight: "700", color: "#635e64ff" },
  categoryName: { fontSize: 13, fontWeight: "700", color: "#8a5994ff" },
  statusText: { fontSize: 14, fontWeight: "600", color: "#651a71ff" },
  userName: { fontSize: 15, fontWeight: "500", color: "#651a71ff" },
  generalText: { fontSize: 14, fontWeight: "700", color: "#651a71ff" },
  button: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  singleButton: {
    flexDirection: "row",
    backgroundColor: "#730871ff",
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#601d77ff",
  },
  filterContainer: {
    gap: 10,
    backgroundColor: "#e4c1eaff",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  filterButton: {
    padding: 15,
    borderRadius: 5,
  },
  filterText: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    color: "#792c72ff",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  statCard: {
    width: "40%",
    backgroundColor: "#fdf1ffff",
    padding: 7,
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 20,
    elevation: 5,
  },
  statTitle: {
    color: "#7b3685ff",
    fontWeight: "700",
    marginTop: 4,
    fontSize: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3f043bff",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#fff5f5",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 17,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },

  title: {
    color: "#b71c1c",
    fontWeight: "700",
    fontSize: 17,
    flex: 1,
    marginBottom: 5,
  },

  points: {
    marginBottom: 10,
  },

  point: {
    color: "#c62828",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
    fontWeight: "600",
  },
});
