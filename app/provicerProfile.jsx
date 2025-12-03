import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import ImageModal from "../components/imageModal";

function getStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating - 1 < i) {
      stars.push(
        <Text key={i} style={{ fontSize: 22, color: "#000000ff" }}>
          ☆
        </Text>
      );
    } else {
      stars.push(
        <Text key={i} style={{ fontSize: 22, color: "#f2ea0dff" }}>
          ★
        </Text>
      );
    }
  }
  return stars;
}

const ProviderProfile = ({ providerInfo, visible, onClose }) => {
  const [showImage, setShowImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const {
    img,
    name,
    price,
    rating,
    about,
    description,
    certifications,
    yearsOfExp,
    experience_photos,
    service_locations,
    field_of_work,
    feedbackData,
  } = providerInfo;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* all over screen */}
      <View style={styles.overlayScreen}>
        {/* provider profile screen */}
        <View style={styles.providerProfile}>
          {/* title */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={styles.title}>Provider Profile</Text>
            <Pressable onPress={onClose} style={styles.cancle}>
              <MaterialIcons name="clear" size={30} color="#601d77ff" />
            </Pressable>
          </View>

          {/* provider info */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 30,
                marginVertical: 20,
              }}
            >
              <Image source={{ uri: img }} style={styles.img} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: 5,
                }}
              >
                <Text style={[styles.title, { fontSize: 25 }]}>{name}</Text>
                <Text style={[styles.title, { fontSize: 21 }]}>
                  {price + " ₪/h"}
                </Text>

                <Text style={styles.title}>{getStars(rating)}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.section}>
                <FontAwesome5 name="briefcase" size={18} color="#4b1d5eff" />
                <Text style={styles.title}>Field of Work</Text>
              </View>
              <Text style={styles.value}>{field_of_work}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <FontAwesome5 name="user" size={18} color="#4b1d5eff" />
                <Text style={styles.title}>About</Text>
              </View>
              <Text style={styles.value}>{about}</Text>
            </View>
            {/* add image of work */}
            <View style={styles.card}>
              <View style={styles.section}>
                <FontAwesome name="photo" size={18} color="#4b1d5eff" />
                <Text style={styles.title}>Work Photos</Text>
              </View>

              {/* to put image model */}
              <ImageModal
                visible={showImage}
                onClose={() => setShowImage(false)}
                img={currentImage}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 10,
                  gap: 20,
                }}
              >
                {experience_photos.map((image, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setCurrentImage(image);
                      setShowImage(true);
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      resizeMode="contain"
                      style={{ borderRadius: 10, width: 140, height: 140 }}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {/* for skills */}
            <View style={styles.card}>
              <View style={styles.section}>
                <FontAwesome5 name="tools" size={18} color="#4b1d5eff" />
                <Text style={styles.title}>Skills & Experience</Text>
              </View>
              <Text style={styles.value}>
                {description +
                  ". Certifications: " +
                  certifications +
                  ", Years Of Exp: " +
                  yearsOfExp}
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={18}
                  color="#4b1d5eff"
                />
                <Text style={styles.title}>Service Locations</Text>
              </View>
              <Text style={styles.value}>{service_locations}</Text>
            </View>

            {/* for feedbacks */}
            <View style={styles.card}>
              <View style={styles.section}>
                <MaterialIcons name="reviews" size={18} color="#4b1d5eff" />
                <Text style={styles.title}>Reviews</Text>
              </View>

              {/* feedbacks */}
              <View>
                {feedbackData.map((feedback, index) => (
                  <View style={styles.reviewRow} key={index}>
                    <FontAwesome5
                      name="user-circle"
                      size={22}
                      color="#4b1d5eff"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{feedback.name}</Text>
                      <Text style={styles.msg}>{feedback.msg}</Text>
                    </View>
                    <View style={styles.dateRate}>
                      <Text style={styles.date}>on {feedback.date}</Text>
                      <Text style={styles.title}>
                        {getStars(feedback.rating)}
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

export default ProviderProfile;

const styles = StyleSheet.create({
  overlayScreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    height: "100%",
  },
  providerProfile: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#fbf0fbff",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    height: "90%",
  },
  img: { width: 100, height: 100, borderRadius: 50 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#663279ff",
    textShadowColor: "rgba(106, 8, 117, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4b1d5eff",
    paddingLeft: 15,
    paddingBottom: 20,
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(157, 83, 165, 0.3)",
    marginVertical: 10,
    paddingHorizontal: 10,
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
  },

  dateRate: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 3,
  },

  msg: {
    color: "#741f6bff",
    fontSize: 13.5,
    fontWeight: "600",
  },

  date: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
  },
});
