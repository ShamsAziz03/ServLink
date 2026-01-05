import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import ImageModal from "../../components/imageModal";

function getStars(rating) {
  const stars = [];
  const clamped = Math.max(0, Math.min(5, rating));

  for (let i = 0; i < 5; i++) {
    if (clamped >= i + 1) {
      // full star
      stars.push(
        <Text key={i} style={{ fontSize: 22, color: "#f2ea0dff" }}>
          ★
        </Text>
      );
    } else if (clamped >= i + 0.5) {
      // half star
      stars.push(
        <Text key={i} style={{ fontSize: 22, color: "#f2ea0dff" }}>
          ⯪
        </Text>
      );
    } else {
      // empty star
      stars.push(
        <Text key={i} style={{ fontSize: 22, color: "#000000ff" }}>
          ☆
        </Text>
      );
    }
  }

  return stars;
}

const ServiceInfoModal = ({ visible, onClose, service }) => {
  const [showImage, setShowImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [providerExpImages, setProviderExpImages] = useState([
    "http://10.0.2.2:5000/assets/agriculture.png",
    "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
  ]);
  const [feedbacks, setFeedbakcs] = useState([
    {
      first_name: "John",
      last_name: "Doe",
      feedback_text: "Great service. Everything was smooth and fast.",
      rated_at: "2025-01-12",
      score: 5,
    },
    {
      first_name: "Sarah",
      last_name: "Ahmed",
      feedback_text: "Good overall, but delivery took longer than expected.",
      rated_at: "2025-01-08",
      score: 4,
    },
    {
      first_name: "Michael",
      last_name: "Lee",
      feedback_text: "Average experience. Support was responsive though.",
      rated_at: "2024-12-29",
      score: 3,
    },
  ]);
  const [avgRating, setAvgRating] = useState(0);

  const ip = process.env.EXPO_PUBLIC_IP;

  const fetchFeedbacks = async () => {
    const result = await fetch(
      `http://${ip}:5000/serviceProviderServiceList/getProviderServiceFeedbacks/${service.Provider_Services_id}`
    );
    const data = await result.json();
    if (data.length == 0) {
      setFeedbakcs([]);
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].rated_at = data[i].rated_at.substr(0, 10);
        setFeedbakcs(data);
      }
    }
  };

  const fetchAvgRating = async () => {
    const result = await fetch(
      `http://${ip}:5000/serviceProviderServiceList/getProviderServiceAvgRating/${service.Provider_Services_id}`
    );
    const data = await result.json(); //{avgScore: }
    if (data[0]?.avgScore) {
      setAvgRating(data[0].avgScore);
    }
  };

  useEffect(() => {
    if (!service?.images) return;
    const imagesArray = service.images.split(",");
    setProviderExpImages(imagesArray);
    fetchFeedbacks();
    fetchAvgRating();
  }, [service?.Provider_Services_id]);

  if (!service) return;

  const {
    serviceName,
    categoryName,
    description,
    base_price,
    service_location,
  } = service;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Service Details</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Images */}
            <ImageModal
              visible={showImage}
              img={currentImage}
              onClose={() => setShowImage(false)}
            />

            {/* Info */}
            <View style={styles.section}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons
                  name="miscellaneous-services"
                  size={25}
                  color="#65186fff"
                />
                <Text style={styles.serviceTitle}>{serviceName}</Text>
              </View>
              <Text style={styles.category}>{categoryName}</Text>
              <View style={styles.rating}>{getStars(avgRating)}</View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <FontAwesome name="image" size={20} color="#65186fff" />
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
                Experience Images
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {providerExpImages.map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setCurrentImage(img);
                    setShowImage(true);
                  }}
                >
                  <Image source={{ uri: img }} style={styles.image} />
                </Pressable>
              ))}
            </ScrollView>

            <Text
              style={{
                fontSize: 18,
                color: "#741f6bff",
                fontWeight: "600",
                marginTop: 20,
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Description
            </Text>
            <View style={styles.card}>
              <FontAwesome5 name="info-circle" size={18} color="#4b1d5eff" />
              <Text style={styles.value}>{description}</Text>
            </View>

            <Text
              style={{
                fontSize: 18,
                color: "#741f6bff",
                fontWeight: "600",
                marginTop: 20,
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Price
            </Text>
            <View style={styles.card}>
              <FontAwesome name="money" size={23} color="#4b1d5eff" />
              <Text style={styles.value}>{base_price} ₪ / hour</Text>
            </View>

            <Text
              style={{
                fontSize: 18,
                color: "#741f6bff",
                fontWeight: "600",
                marginTop: 20,
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Locations
            </Text>
            <View style={styles.card}>
              <FontAwesome5 name="map-marker-alt" size={18} color="#4b1d5eff" />
              <Text style={styles.value}>{service_location}</Text>
            </View>

            {/* for feedbacks */}
            <Text
              style={{
                fontSize: 18,
                color: "#741f6bff",
                fontWeight: "600",
                marginTop: 20,
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Reviews
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "rgba(157, 83, 165, 0.3)",
                marginVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              {/* feedbacks */}
              <View>
                {feedbacks.map((feedback, index) => (
                  <View style={styles.reviewRow} key={index}>
                    <FontAwesome5
                      name="user-circle"
                      size={22}
                      color="#4b1d5eff"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>
                        {feedback.first_name + " " + feedback.last_name}
                      </Text>
                      <Text style={styles.msg}>{feedback.feedback_text}</Text>
                    </View>
                    <View style={styles.dateRate}>
                      <Text style={styles.date}>on {feedback.rated_at}</Text>
                      <Text style={styles.title}>
                        {getStars(feedback.score)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ServiceInfoModal;
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
    height: "85%",
    borderRadius: 15,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: "#cfcfcfff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8b1e99ff",
  },
  image: {
    width: 140,
    height: 140,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b289b1ff",
  },
  section: {
    marginVertical: 15,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#760b75ff",
    textShadowColor: "rgba(106, 8, 117, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  category: {
    fontSize: 18,
    color: "#741f6bff",
    marginVertical: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(157, 83, 165, 0.3)",
    paddingVertical: 7,
  },
  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5f3074ff",
    flex: 1,
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    gap: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#370336ff",
    textShadowColor: "rgba(106, 8, 117, 0.3)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
  },

  dateRate: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 3,
  },

  msg: {
    color: "#7c4576ff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },

  date: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
  },
});
