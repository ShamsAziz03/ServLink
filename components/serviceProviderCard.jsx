import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import BookingConfirmation from "../app/bookingConfirmation";
import ProviderProfile from "../app/providerProfile";
import React, { useEffect, useState } from "react";

function getStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating - 1 < i) {
      stars.push(
        <Text key={i} style={{ fontSize: 25, color: "#000000ff" }}>
          ☆
        </Text>
      );
    } else {
      stars.push(
        <Text key={i} style={{ fontSize: 25, color: "#660468ff" }}>
          ★
        </Text>
      );
    }
  }
  return stars;
}

const ServiceProviderCard = ({ serviceProviderInfo }) => {
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showProviderProfile, setShowProviderProfile] = useState(false);

  const [rating, setRating] = useState(0);

  const fetchProviderRating = async () => {
    const result = await fetch(
      `http://10.0.2.2:5000/bookingService/getProviderRating/${serviceProviderInfo.provider_id}`
    );
    const data = await result.json();
    if (data.length != 0) {
      setRating(data[0].max_rating);
    } else setRating(1);
  };
  useEffect(() => {
    setRating(0);
    fetchProviderRating();
  }, []);

  return (
    // full view of card
    <View style={styles.fullView}>
      {/* view of basic info */}
      <View style={styles.basicInfo}>
        <Image
          source={{ uri: serviceProviderInfo.id_card_photo }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.text}>
            {serviceProviderInfo.first_name +
              " " +
              serviceProviderInfo.last_name}
          </Text>
          <Text style={styles.text}>
            {serviceProviderInfo.base_price + " ₪/h"}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            {getStars(rating)}
          </View>
        </View>
      </View>
      <Text
        style={[styles.text, { fontSize: 17, fontWeight: "700", margin: 5 }]}
      >
        {serviceProviderInfo.aboutProvider}
      </Text>
      <View
        style={{
          flexDirection: "column",
          marginTop: 10,
          gap: 5,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#8f479aff",
            padding: 8,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={() => {
            setShowBookingConfirmation(true);
          }}
        >
          <Text style={{ fontSize: 17, color: "#ffffffff", fontWeight: "800" }}>
            Select and Book
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#8f479aff",
            padding: 8,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={() => {
            setShowProviderProfile(true);
          }}
        >
          <Text style={{ fontSize: 17, color: "#ffffffff", fontWeight: "800" }}>
            View Profile
          </Text>
        </Pressable>
      </View>
      {/* to show the booking confirmation page */}
      <BookingConfirmation
        visible={showBookingConfirmation}
        onClose={() => setShowBookingConfirmation(false)}
        providerId={serviceProviderInfo.provider_id}
      />

      {/* to show the provider profile page */}
      <ProviderProfile
        visible={showProviderProfile}
        onClose={() => setShowProviderProfile(false)}
        providerInfo={serviceProviderInfo}
      />
    </View>
  );
};

export default ServiceProviderCard;

const styles = StyleSheet.create({
  fullView: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#fffaffff",
    borderColor: "#aa80a9ff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 20,
    marginTop: 15,
  },
  basicInfo: {
    flexDirection: "row",
    gap: 20,
  },
  image: { width: 100, height: 100, borderRadius: 100 },
  details: { flexDirection: "column", marginTop: 20 },
  text: { color: "#7b3685ff", fontSize: 22, fontWeight: "700" },
});
