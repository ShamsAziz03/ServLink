import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BookDetails from "./bookDetails";
import { AppContext } from "../../context/AppContext";

export default function ProviderRequests() {
  const router = useRouter();
  const API_ADDRESS = "http://10.0.2.2:5000";
  const { loggedUser } = useContext(AppContext);

  const [originalBookings, setOriginalBookings] = useState([
    {
      booking_id: 16,
      status: "Completed",
      service_date: "2025-11-28",
      service_time: "17:45:00",
      payment_method: "Cash",
      address: "Jenin - City Center",
      notes: "Customer satisfied with the service",
      created_at: "2025-11-30 12:20:30",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: 100,
      total_price: "95.00",
      first_name: "Shams",
      last_name: "Aziz",
      serviceName: "Helping disabled at home",
      categoryName: "Cleaning",
      phone: "+123456789",
    },
    {
      booking_id: 7,
      status: "Cancelled",
      service_date: "2025-10-19",
      service_time: "09:00:00",
      payment_method: "Cash",
      address: "321 Pine Road, Manhattan",
      notes: "Babysitting booking cancelled",
      created_at: "2025-10-18 17:10:00",
      is_accept: "rejected",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: 25,
      total_price: "25.00",
      first_name: "Jane",
      last_name: "Smith",
      serviceName: "Baby Sitting",
      categoryName: "Child Care",
      phone: "+123456789",
    },
    {
      booking_id: 14,
      status: "Pending",
      service_date: "2025-11-02",
      service_time: "15:30:00",
      payment_method: "Credit Card",
      address: "Nablus - Rafidia",
      notes: "Client requested eco-friendly materials",
      created_at: "2025-11-30 12:20:30",
      is_accept: "pending",
      estimated_time: "2.50",
      duration_time: null,
      actual_total_price: null,
      total_price: 130,
      first_name: "Shams",
      last_name: "Aziz",
      serviceName: "Baby Sitting",
      categoryName: "Child Care",
      phone: "+123456789",
    },
  ]);

  const [bookings, setBookings] = useState([
    {
      booking_id: 16,
      status: "Completed",
      service_date: "2025-11-28",
      service_time: "17:45:00",
      payment_method: "Cash",
      address: "Jenin - City Center",
      notes: "Customer satisfied with the service",
      created_at: "2025-11-30 12:20:30",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: 100,
      total_price: "95.00",
      first_name: "Shams",
      last_name: "Aziz",
      serviceName: "Helping disabled at home",
      categoryName: "Cleaning",
      phone: "+123456789",
    },
    {
      booking_id: 7,
      status: "Cancelled",
      service_date: "2025-10-19",
      service_time: "09:00:00",
      payment_method: "Cash",
      address: "321 Pine Road, Manhattan",
      notes: "Babysitting booking cancelled",
      created_at: "2025-10-18 17:10:00",
      is_accept: "rejected",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: 25,
      total_price: 30,
      first_name: "Jane",
      last_name: "Smith",
      serviceName: "Baby Sitting",
      categoryName: "Child Care",
      phone: "+123456789",
    },
    {
      booking_id: 14,
      status: "Pending",
      service_date: "2025-11-02",
      service_time: "15:30:00",
      payment_method: "Credit Card",
      address: "Nablus - Rafidia",
      notes: "Client requested eco-friendly materials",
      created_at: "2025-11-30 12:20:30",
      is_accept: "pending",
      estimated_time: "2.50",
      duration_time: null,
      actual_total_price: null,
      total_price: 130,
      first_name: "Shams",
      last_name: "Aziz",
      serviceName: "Baby Sitting",
      categoryName: "Child Care",
      phone: "+123456789",
    },
  ]);

  const [selectedOption, setSelectedOption] = useState("All");
  const [showBookDetails, setShowBookDetails] = useState(null);

  const options = [
    "All",
    "Cancelled",
    "Completed",
    "Pending Response",
    "In Progress",
  ];

  const statusColors = {
    accepted: "#a9c9a2ff",
    rejected: "#e55353ff",
    pending: "orange",
    completed: "#79c279ff",
    cancelled: "red",
    default: "gray",
  };
  const filterBooks = () => {
    if (selectedOption === "All") {
      setBookings(originalBookings);
    } else if (selectedOption === "Cancelled") {
      const newBooks = originalBookings.filter(
        (b) =>
          b.status.toLowerCase() === "cancelled" &&
          b.is_accept.toLowerCase() === "rejected"
      );
      setBookings(newBooks);
    } else if (selectedOption === "Completed") {
      const newBooks = originalBookings.filter(
        (b) =>
          b.status.toLowerCase() === "completed" &&
          b.is_accept.toLowerCase() === "accepted"
      );
      setBookings(newBooks);
    } else if (selectedOption === "Pending Response") {
      const newBooks = originalBookings.filter(
        (b) =>
          b.status.toLowerCase() === "pending" &&
          b.is_accept.toLowerCase() === "pending"
      );
      setBookings(newBooks);
    } else if (selectedOption === "In Progress") {
      const newBooks = originalBookings.filter(
        (b) =>
          b.status.toLowerCase() === "pending" &&
          b.is_accept.toLowerCase() === "accepted"
      );
      setBookings(newBooks);
    }
  };

  const fetchBooks = async () => {
    const id = loggedUser?.id || 2;
    const result = await fetch(
      `${API_ADDRESS}/providerBookings/getProviderBookings/${id}`
    );
    const fetchedData = await result.json();
    setOriginalBookings(fetchedData);
    setBookings(fetchedData);
  };

  const updateBook = async (obj) => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/providerBookings/updateBook`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        fetchBooks();
      } else {
        console.error(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAccept = (bookId) => {
    const obj = { bookId: bookId, is_accept: "accepted", status: "pending" };
    updateBook(obj);
  };

  const handleReject = (bookId) => {
    const obj = { bookId: bookId, is_accept: "rejected", status: "Cancelled" };
    updateBook(obj);
  };

  useEffect(() => {
    filterBooks();
  }, [selectedOption]);

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, marginBottom: 10, marginTop: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              gap: 40,
              marginTop: 15,
              marginBottom: 35,
            }}
          >
            <Pressable
              onPress={() => router.push("/ProviderPages/profileUser")}
            >
              <Ionicons name="arrow-back" size={30} color="#601d77ff" />
            </Pressable>
            <Text style={styles.headerText}>Requests of Bookings</Text>
          </View>

          {/* Filters */}
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.filterContainer}
          >
            {options.map((option, index) => {
              const isActive = selectedOption === option;
              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedOption(option)}
                  style={[
                    styles.filterButton,
                    { backgroundColor: isActive ? "#631176ff" : "#e4c1eaff" },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: isActive ? "#fff" : "#3d045bff" },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* for show modal */}
          <BookDetails
            visible={showBookDetails !== null}
            onClose={() => setShowBookDetails(null)}
            book={showBookDetails}
          />

          {/* Booking List */}
          {bookings.length ? (
            bookings.map((item) => (
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
                      backgroundColor:
                        statusColors[item.status.toLowerCase()] ||
                        statusColors.default,
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
                      backgroundColor:
                        statusColors[item.is_accept.toLowerCase()] ||
                        statusColors.default,
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
                    {item.actual_total_price === null
                      ? item.total_price
                      : item.actual_total_price}
                    ₪
                  </Text>
                </View>

                {/* User Name and phone */}
                <View style={styles.viewRow}>
                  <View style={styles.infoRow}>
                    <FontAwesome
                      name="user"
                      size={16}
                      color="#651a71ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.userName}>
                      {item.first_name} {item.last_name}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="call"
                      size={16}
                      color="#401c47ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.generalText}>{item.phone}</Text>
                  </View>
                </View>
                <View style={styles.viewRow}>
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
                {/*  Address */}
                <View style={styles.viewRow}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-sharp"
                      size={16}
                      color="#401c47ff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.generalText}>{item.address}</Text>
                  </View>
                </View>

                {/* Buttons */}
                <View style={{ marginTop: 15 }}>
                  {item.is_accept.toLowerCase() === "pending" ? (
                    <View style={styles.viewRow}>
                      <Pressable
                        style={[styles.button, { backgroundColor: "#4CAF50" }]}
                        onPress={() => {
                          Alert.alert(
                            "Confirm Accept",
                            "Are you sure you want to accept this booking?",
                            [
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                              {
                                text: "Yes",
                                onPress: () => {
                                  handleAccept(item.booking_id);
                                },
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.buttonText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.button,
                          { backgroundColor: "#cc0808ff" },
                        ]}
                        onPress={() => {
                          Alert.alert(
                            "Confirm Reject",
                            "Are you sure you want to reject this booking?",
                            [
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                              {
                                text: "Yes",
                                onPress: () => {
                                  handleReject(item.booking_id);
                                },
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.buttonText}>Reject</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.button,
                          { backgroundColor: "#730871ff" },
                        ]}
                        onPress={() => {
                          setShowBookDetails(item);
                        }}
                      >
                        <FontAwesome
                          name="info-circle"
                          size={16}
                          color="white"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.buttonText}>Details</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.singleButton}
                      onPress={() => {
                        setShowBookDetails(item);
                      }}
                    >
                      <FontAwesome
                        name="info-circle"
                        size={16}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.buttonText}>Details</Text>
                    </Pressable>
                  )}
                </View>
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
  card: {
    backgroundColor: "#fdf6ffff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  viewRow: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginBottom: 15,
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
    fontSize: 22,
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
});