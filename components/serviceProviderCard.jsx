import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import BookingConfirmation from "../app/bookingConfirmation";
import ProviderProfile from "../app/provicerProfile";
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

const ServiceProviderCard = ({ name, price, img, rating, description }) => {
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showProviderProfile, setShowProviderProfile] = useState(false);
  const feedbackData = [
    {
      name: "Seventh S.",
      msg: "Handled the setup quickly and without issues.",
      date: "Thu, Nov 27",
      rating: 3,
    },
    {
      name: "Seventh S.",
      msg: "Assembly went smooth and efficient.",
      date: "Tue, Nov 25",
      rating: 2,
    },
    {
      name: "John D.",
      msg: "Cleaning was solid and met expectations.",
      date: "Mon, Dec 02",
      rating: 4,
    },
  ];
  const experience_photos = [
    "http://10.0.2.2:5000/assets/agriculture.png",
    "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
    "http://10.0.2.2:5000/assets/Mounting_TV_on_wall.png",
  ];
  const [providerInfo, setProviderInfo] = useState({
    field_of_work: "Home Cleaning",
    img: "http://10.0.2.2:5000/assets/topProviders/icon2.jpg",
    name: "Ali Hasan",
    price: 25.0,
    rating: 4,
    about:
      "Expert in home and office cleaning services, including deep cleaning and maintenance.",
    description:
      "I’m a cleaner who actually knows what thorough means. I handle homes and offices with deep-clean precision",
    certifications:
      "Cleaning Certification Level 2, Safety Training Certificate",
    yearsOfExp: "5",
    experience_photos: experience_photos,
    service_locations: "New York, Brooklyn, Queens",
    feedbackData: feedbackData,
  });

  return (
    // full view of card
    <View style={styles.fullView}>
      {/* view of basic info */}
      <View style={styles.basicInfo}>
        <Image source={{ uri: img }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.text}>{price + " ₪/h"}</Text>
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
        {description}
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
      />

      {/* to show the provider profile page */}
      <ProviderProfile
        visible={showProviderProfile}
        onClose={() => setShowProviderProfile(false)}
        providerInfo={providerInfo}
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
