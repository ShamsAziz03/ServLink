import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";

function getStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating - 1 < i) {
      stars.push(
        <Text key={i} style={{ fontSize: 30, color: "#000000ff" }}>
          ☆
        </Text>
      );
    } else {
      stars.push(
        <Text key={i} style={{ fontSize: 30, color: "#660468ff" }}>
          ★
        </Text>
      );
    }
  }
  return stars;
}

const ServiceProviderCard = ({ name, price, img, rating, description }) => {
  return (
    // full view of card
    <View style={styles.fullView}>
      {/* view of basic info */}
      <View style={styles.basicInfo}>
        <Image
          source={{ uri: img }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={[styles.basicInfo, { justifyContent: "space-between" }]}>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.text}>{price + " ₪/h"}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            {getStars(rating)}
          </View>
        </View>
      </View>
      <Text style={[styles.text, { fontSize: 15, fontWeight: "900" ,margin:5}]}>
        {description}
      </Text>
      <Pressable
        style={{
          backgroundColor: "#7b3685ff",
          padding: 5,
          borderRadius: 10,
          alignItems: "center",
          marginHorizontal: 80,
        }}
      >
        <Text style={{ fontSize: 15, color: "#f5def9ff", fontWeight: "500" }}>
          Select
        </Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: "#7b3685ff",
          padding: 5,
          borderRadius: 10,
          alignItems: "center",
          marginHorizontal: 80,
        }}
      >
        <Text style={{ fontSize: 15, color: "#f5def9ff", fontWeight: "500" }}>
          View Profile
        </Text>
      </Pressable>
    </View>
  );
};

export default ServiceProviderCard;

const styles = StyleSheet.create({
  fullView: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#f5e8f5ff",
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
  image: { width: 100, height: 100, borderRadius: 10 },
  details: { flexDirection: "column" , marginTop:20},
  text: { color: "#7b3685ff", fontSize: 18, fontWeight: "700" },
});
