import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import CardPayment from "../components/cardPaymentView";
import { StripeProvider } from "@stripe/stripe-react-native";

const Payment = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    loggedUser,
    bookingObject,
    setBookingObject,
    currentService,
    userCurrentLocation,
    questionsAnswers,
  } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState("cache");
  const [confirmed, setConfirmed] = useState(false);
  const API_URL = "http://10.0.2.2:5000";

  const fetchStoreAnswers = async (bookId) => {
    console.log("questionsAnswers:", questionsAnswers);

    try {
      const response = await fetch(`${API_URL}/serviceQuestions/storeAnswers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questionsAnswers,
          bookId: bookId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.warn("Failed to store answers:", result.message);
        return false;
      }

      console.log(result.message);
      return true; // return success
    } catch (err) {
      console.error("Error storing answers:", err);
      return false;
    }
  };

  const handleConfimButton = async () => {
    //add book and transaction to db
    // 1. create booking
    const bookingRes = await fetch(`${API_URL}/bookingService/addBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: bookingObject.providerId,
        hourlyRate: bookingObject.hourlyRate,
        expectedTime: bookingObject.expectedTime,
        serviceDate: bookingObject.serviceDate,
        serviceTime: bookingObject.serviceTime,
        typeOfPayment: "cache",
        userId: loggedUser.user_id,
        serviceId: currentService.service_id,
        location: userCurrentLocation.display_name,
        estimated_time: bookingObject.expectedTime,
      }),
    });

    const bookingData = await bookingRes.json();
    const bookingId = bookingData.insertId;

    if (!bookingId) console.error("can't added new book to db");

    console.log("Booking ID:", bookingId);

    // 2. create transaction linked to booking
    console.log(
      bookingObject.typeOfPayment +
        bookingObject.hourlyRate * bookingObject.expectedTime
    );
    const result = await fetch(`${API_URL}/bookingService/addTransaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_id: 0,
        booking_id: bookingId,
        type: bookingObject.typeOfPayment,
        amount: bookingObject.hourlyRate * bookingObject.expectedTime,
      }),
    });

    const transactionData = await result.json();
    console.log("Transaction:", transactionData);
    const answersResult = await fetchStoreAnswers(bookingId);
    if (bookingId && transactionData.insertId && answersResult) {
      setConfirmed(true);
    } else {
      console.error("Booking, transaction, or answers failed");
    }
  };

  const setPageContent = () => {
    if (!loggedUser.first_name) {
      //user not logged yet
      return (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
            marginTop: 150,
          }}
        >
          <MaterialIcons name="clear" size={50} color={"#bb0e0eff"} />
          <Text style={styles.notLogText}>YOU ARE NOT LOGGED IN YET ! </Text>
          <Text style={styles.notLogText}>SIGN IN FIRST</Text>
          <Text style={styles.notLogText}>
            {"Your final amount comes out to: " +
              bookingObject.hourlyRate * bookingObject.expectedTime +
              " ₪"}
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate("login");
            }}
            style={{
              marginTop: 30,
              backgroundColor: "#750d83ff",
              padding: 10,
              paddingHorizontal: 100,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#e4e0e6ff",
                fontSize: 20,
                textAlign: "center",
                fontWeight: "900",
              }}
            >
              Join Us Now
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 20,
          }}
        >
          <Text style={styles.text}>Choose Payment Method:</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              style={[
                {
                  backgroundColor: "#6d1279ff",
                  padding: 7,
                  borderRadius: 10,
                  width: "45%",
                },
                selectedOption !== "cache" && styles.notSelectedButton,
              ]}
              onPress={() => {
                setSelectedOption("cache");
              }}
            >
              <Text
                style={[
                  {
                    color: "#fdf2ffff",
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                  },
                  selectedOption !== "cache" && { color: "#561062ff" },
                ]}
              >
                Cash
              </Text>
            </Pressable>
            <Pressable
              style={[
                {
                  backgroundColor: "#6d1279ff",
                  padding: 7,
                  borderRadius: 10,
                  width: "45%",
                },
                selectedOption !== "card" && styles.notSelectedButton,
              ]}
              onPress={() => {
                setSelectedOption("card");
              }}
            >
              <Text
                style={[
                  {
                    color: "#fdf2ffff",
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                  },
                  selectedOption !== "card" && { color: "#561062ff" },
                ]}
              >
                Credit Card
              </Text>
            </Pressable>
          </View>
          <Text style={styles.notLogText}>
            {"Pay /hour: " + bookingObject.hourlyRate + " ₪"}
          </Text>
          <Text style={styles.notLogText}>
            {"Your final amount: " +
              bookingObject.hourlyRate * bookingObject.expectedTime +
              " ₪"}
          </Text>
          {selectedOption === "cache" && !confirmed && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 20,
              }}
            >
              <Text style={styles.notLogText}>
                Please press confim button to confirm your booking
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#87288bff",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginTop: 10,
                  marginHorizontal: 50,
                }}
                onPress={() => {
                  handleConfimButton();
                }}
              >
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedOption === "cache" && confirmed && (
            <View style={styles.successContainer}>
              <Text style={styles.check}>✓</Text>

              <Text style={styles.title}>Thank You</Text>

              <Text style={styles.message}>Your Booking Is Confirmed.</Text>

              <Text style={styles.note}>
                please pay the service provider in cash.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("(dashboard)", { screen: "home" })
                }
              >
                <Text style={styles.buttonText}>Back To Home</Text>
              </TouchableOpacity>
            </View>
          )}
          {selectedOption === "card" && (
            <View style={{ marginTop: 30 }}>
              <CardPayment />
            </View>
          )}
        </View>
      );
    }
  };

  useEffect(() => {
    setBookingObject((prev) => ({
      ...prev,
      typeOfPayment: selectedOption,
    }));
  }, [selectedOption]);

  return (
    <StripeProvider publishableKey="pk_test_51SdZAODJYGOBdfm98GN8CTS8ZZUoMWXtSbZpH9F4RcmtT32YBNDWUIvorbAFk9VH9v5Cw9HY4yTHEe1hi8GJm7uR008z79S4QH">
      <LinearGradient
        colors={["#fcf4fcff", "#e8d0ebff"]}
        style={{ flex: 1, justifyContent: "space-between", padding: 20 }}
      >
        <View
          style={[
            styles.fullView,
            {
              paddingBottom: insets.bottom,
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          {/* for the header of page */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              textAlign: "center",
              marginBottom: 30,
              borderBottomColor: "#82538dff",
              borderBottomWidth: 0.5,
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("(dashboard)", { screen: "home" });
              }}
            >
              <MaterialIcons name="clear" size={35} color={"#7b3685ff"} />
            </Pressable>
            <Text
              style={{
                color: "#7b3685ff",
                fontSize: 22,
                fontWeight: "900",
                paddingLeft: 20,
                textAlign: "center",
              }}
            >
              Check out payment
            </Text>
          </View>

          {/* change the content depends on if stmt */}
          <View>{setPageContent()}</View>
        </View>
      </LinearGradient>
    </StripeProvider>
  );
};

export default Payment;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  text: {
    color: "#7b3685ff",
    fontSize: 20,
    fontWeight: "700",
    paddingTop: 20,
    textShadowColor: "#9c81a9ff",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  check: {
    fontSize: 70,
    color: "#2f7540ff",
    marginBottom: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 8,
    color: "#5a0654ff",
  },
  message: {
    fontSize: 17,
    marginBottom: 4,
    color: "#7a0a73ff",
  },
  note: {
    fontSize: 15,
    color: "#936d91ff",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#700874ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  notLogText: {
    color: "#7b3685ff",
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: "#9c81a9ff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  notSelectedButton: {
    backgroundColor: "#c8a4ccff",
  },
});
