import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import {
  CardField,
  useConfirmPayment,
  useStripe,
} from "@stripe/stripe-react-native";
import { AppContext } from "../context/AppContext";
import { Link, useNavigation } from "@react-navigation/native";

  const ip = process.env.EXPO_PUBLIC_IP;
const API_URL = `http://${ip}:5000`;

const CardPayment = () => {
  const [cardDetails, setCardDetails] = useState();
  const { loading } = useConfirmPayment();
  const {
    loggedUser,
    bookingObject,
    questionsAnswers,
    currentService,
    userCurrentLocation,
    setBookingObject,
  } = useContext(AppContext);
  const [email, setEmail] = useState(loggedUser.email);
  const { confirmSetupIntent } = useStripe();
  const navigation = useNavigation();

  const fetchCustomer = async () => {
    const response = await fetch(`${API_URL}/payment/createCustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: loggedUser,
      }),
    });
    const result = await response.json();
    return result.customer; //customer obj from stripe if not exist in db, or if it exist then return obj from db
  };

  const fetchSetupIntent = async (id) => {
    const response = await fetch(`${API_URL}/payment/createSetupIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: id,
      }),
    });
    const setupIntent = await response.json();
    return setupIntent.clientSecret;
  };

  const updatePaymentMethod = async (paymentMethodId, customerId) => {
    try {
      const response = await fetch(
        `${API_URL}/payment/updatePaymentMethodByCustomer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            paymentMethodId: paymentMethodId,
          }),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating payment method:", error);
      throw error;
    }
  };

  const fetchStoreAnswers = async (bookId) => {
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

  const addBookAndAnswers = async () => {
    const bookingRes = await fetch(`${API_URL}/bookingService/addBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: bookingObject.providerId,
        hourlyRate: bookingObject.hourlyRate,
        expectedTime: bookingObject.expectedTime,
        serviceDate: bookingObject.serviceDate,
        serviceTime: bookingObject.serviceTime,
        typeOfPayment: "card",
        userId: loggedUser.user_id,
        serviceId: currentService.service_id,
        location: userCurrentLocation.display_name,
        estimated_time: bookingObject.expectedTime,
      }),
    });

    const bookingData = await bookingRes.json();
    const bookingId = bookingData.insertId;
    setBookingObject((prev) => ({
      ...prev,
      bookingId: bookingId,
    }));

    if (!bookingId) console.error("can't added new book to db");

    console.log("Booking ID:", bookingId);

    const answersResult = await fetchStoreAnswers(bookingId);
    if (bookingId && answersResult) {
      console.log("add new book and answers success");
    } else {
      console.error("Booking, transaction, or answers failed");
    }
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !email) {
      alert("Please enter Complete card details and Email");
      return;
    }
    console.log("card details : ", cardDetails);

    //to create customer or get it from db
    const customer = await fetchCustomer();
    if (customer.user_id) {
      //exist in db
      console.log("customer exist in db  = ", customer);
      alert("Success - (from DB)");
      await addBookAndAnswers();
      return;
    } else if (customer.id) {
      //does not exist in db
      console.log("customer added to db = ", customer);
      const clientSecret = await fetchSetupIntent(customer.id);

      const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: "Card",
      });
      if (error) {
        alert(error.message);
        return;
      }
      const paymentMethodId = setupIntent.paymentMethod;
      console.log("Payment method ID:", paymentMethodId);
      const result = await updatePaymentMethod(paymentMethodId.id, customer.id);
      if (result.success) {
        await addBookAndAnswers();
        alert("Success, ", result.message);
      } else {
        alert("Bad not Success, ", result.message);
      }
    }
  };

  const fetchPaymentIntent = async (customerId, paymentMethodId, amount) => {
    const response = await fetch(`${API_URL}/payment/paymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        amount: amount * 100,
      }),
    });
    const paymentIntent = await response.json();
    return paymentIntent.status;
  };

  const updateAmongWallet = async (among) => {
    const response = await fetch(`${API_URL}/payment/updateAmongWallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loggedUser.user_id,
        among: among,
      }),
    });
    const result = await response.json();
    return result;
  };
  const pay = async () => {
    const response = await fetch(
      `${API_URL}/payment/getUserWallet?userId=${loggedUser.user_id}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.userWallet) {
      const walletId = result.userWallet.wallet_id;
      const among = bookingObject.hourlyRate * bookingObject.expectedTime;
      const userWallet = result.userWallet;
      const status = await fetchPaymentIntent(
        userWallet.stripe_customer_id,
        userWallet.stripe_payment_method_id,
        among
      );
      if (status === "succeeded") {
        const result = await updateAmongWallet(among);
        if (result) {
          const result = await fetch(
            `${API_URL}/bookingService/addTransaction`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                wallet_id: walletId,
                booking_id: bookingObject.bookingId,
                type: bookingObject.typeOfPayment,
                amount: bookingObject.hourlyRate * bookingObject.expectedTime,
              }),
            }
          );
          const transactionData = await result.json();
          console.log("Transaction:", transactionData);

          alert("payment success");
        } else {
          alert("payment not success !");
          return;
        }
        navigation.navigate("(dashboard)", { screen: "home" });
      } else {
        alert("payment not success xxxx");
      }
    } else {
      console.error("No user Wallet to take money from");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={loggedUser.email}
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={(value) => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <Pressable
        onPress={() => {
          handlePayPress();
        }}
        disabled={loading}
        style={{
          width: "85%",
          marginTop: 80,
          backgroundColor: "#750d83",
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 20,
        }}
      >
        <Text
          style={{
            color: "#f3eef6",
            fontSize: 22,
            fontWeight: "900",
          }}
        >
          Pay
        </Text>
      </Pressable>

      <Pressable
        style={{ padding: 20, backgroundColor: "#888" }}
        onPress={() => {
          pay();
        }}
      >
        <Text>test</Text>
      </Pressable>
    </View>
  );
};

export default CardPayment;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    paddingTop: 20,
  },
  input: {
    backgroundColor: "#ffffffef",
    borderRadius: 8,
    fontSize: 20,
    height: 60,
    padding: 20,
    color: "#69065fff",
  },
  card: {
    backgroundColor: "#faf3fdef",
  },
  cardContainer: {
    height: 60,
    marginVertical: 30,
  },
});
