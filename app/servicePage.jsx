import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";

const CategoryPage = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();
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

  const navigation = useNavigation();
  const route = useRoute();
  const { serviceInfo } = route.params;

  const feedbackData = [
    {
      feedback_id: 1,
      user_name: "ahmad ali",
      service_id: 1,
      rating: 3,
      comment: "Furniture assembly was okay, met expectations.",
      date_time: "2025-10-18 12:00:00",
    },
    {
      feedback_id: 2,
      user_name: "ahmad ali",
      service_id: 2,
      rating: 4,
      comment: "Sink fixed well, minor delay in arrival.",
      date_time: "2025-10-13 09:00:00",
    },
    {
      feedback_id: 3,
      user_name: "ahmad ali",
      service_id: 4,
      rating: 5,
      comment: "Backyard looks amazing after tree trimming, highly satisfied!",
      date_time: "2025-10-27 10:30:00",
    },
    {
      feedback_id: 4,
      service_id: 6,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      service_id: 1,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      service_id: 2,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      service_id: 3,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
  ];
  const providers = [
    {
      id: 1,
      provider_id: 1,
      first_name: "Omar",
      last_name: "Khaled",
      name: "Home Cleaning",
      service_id: 1,
      service_locations: "New York, Brooklyn, Queens",
      years_of_experience: 5,
      languages: "English, Arabic",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
    },
    {
      id: 2,
      provider_id: 2,
      first_name: "Samer",
      last_name: "Ahmad",
      name: "Furniture Assembly",
      service_id: 2,
      service_locations: "Brooklyn, Queens",
      years_of_experience: 3,
      languages: "English",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon2.jpg",
    },
    {
      id: 3,
      provider_id: 3,
      first_name: "Sara",
      last_name: "Zahi",
      name: "Gardening & Lawn Care",
      service_id: 3,
      service_locations: "Manhattan, Bronx",
      years_of_experience: 4,
      languages: "English, Spanish",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon3.jpg",
    },
    {
      id: 4,
      provider_id: 4,
      first_name: "John",
      last_name: "Doe",
      name: "Plumbing",
      service_id: 4,
      service_locations: "Queens, Brooklyn",
      years_of_experience: 6,
      languages: "English",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon4.jpg",
    },
    {
      id: 5,
      provider_id: 5,
      first_name: "Jane",
      last_name: "Smith",
      name: "Electrical Services",
      service_id: 5,
      service_locations: "Manhattan, Bronx, Queens",
      years_of_experience: 7,
      languages: "English, French",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon2.jpg",
    },
    {
      id: 6,
      provider_id: 1,
      first_name: "Omar",
      last_name: "Khaled",
      name: "Home Cleaning",
      service_id: 2,
      service_locations: "New York, Brooklyn, Queens",
      years_of_experience: 5,
      languages: "English, Arabic",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
    },
    {
      id: 7,
      provider_id: 2,
      first_name: "Samer",
      last_name: "Ahmad",
      name: "Furniture Assembly",
      service_id: 1,
      service_locations: "Brooklyn, Queens",
      years_of_experience: 3,
      languages: "English",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon2.jpg",
    },
    {
      id: 8,
      provider_id: 1,
      first_name: "Omar",
      last_name: "Khaled",
      name: "Home Cleaning",
      service_id: 3,
      service_locations: "New York, Brooklyn, Queens",
      years_of_experience: 5,
      languages: "English, Arabic",
      id_card_photo: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
    },
  ];

  return (
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
      {/* for header of page with return button */}
      <View style={styles.header}>
        <Link href="/categoryPage">
          <Ionicons name="arrow-back-outline" size={35} color={"#7b3685ff"} />
        </Link>
        <Text style={styles.text}>{serviceInfo.title}</Text>
      </View>

      {/* page for each service */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          padding: 10,
          paddingVertical: 20,
        }}
      >
        {/* image */}
        <View style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: serviceInfo.image }}
            style={{
              width: width - 50,
              height: 250,
              borderRadius: 20,
            }}
          />
        </View>
        {/* identification for the service */}
        <Text
          style={{
            fontSize: 25,
            fontWeight: "900",
            letterSpacing: 1,
            color: "#5f0557ff",
            textShadowColor: "#c7add4ff",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
            paddingBottom: 20,
            marginRight: 100,
          }}
        >
          ABOUT THE SERVICE
        </Text>
        <LinearGradient
          colors={["#fcf4fcff", "#d7afdcff"]} // purple gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 30,
            marginBottom: 15,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            width: "94%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "900",
                letterSpacing: 1,
                color: "#5f0557ff",
                textShadowColor: "#c7add4ff",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 2,
                paddingBottom: 10,
              }}
            >
              {serviceInfo.title}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 0.5,
                color: "#800776ff",
                textShadowColor: "#c7add4ff",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 2,
              }}
            >
              {serviceInfo.description}
            </Text>
            <Text
              style={{
                fontSize: 19,
                fontWeight: "700",
                letterSpacing: 0.5,
                color: "#5b0453ff",
                textShadowColor: "#c7add4ff",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                marginTop: 10,
                marginLeft: 60,
                backgroundColor: "#debedbff",
                borderRadius: 10,
                padding: 8,
                width: 180,
              }}
            >
              {"Starting at: " + serviceInfo.price + " ₪"}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 15,
              }}
            >
              {getStars(serviceInfo.rating)}
            </View>
          </View>
        </LinearGradient>
        {/* book now button */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("login")}
          >
            <Text style={[styles.buttonText, { fontSize: 20 }]}>
              Book Service Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* for service providers of this service */}
        <Text
          style={{
            fontSize: 25,
            fontWeight: "900",
            letterSpacing: 1,
            color: "#5f0557ff",
            textShadowColor: "#c7add4ff",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
            marginRight: 50,
            marginTop: 50,
          }}
        >
          WHO GIVES THE SERVICE
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 40,
            padding: 25,
            paddingHorizontal: 30,
          }}
        >
          {providers
            .filter(
              (provider) => provider.service_id === serviceInfo.service_id
            )
            .map((provider) => (
              <View
                key={provider.id}
                style={{
                  alignItems: "center",
                  backgroundColor: "#f1e3f6ff",
                  padding: 10,
                  borderRadius: 10,
                  shadowColor: "#593962ff",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.8,
                  shadowRadius: 16,
                  elevation: 15,
                }}
              >
                <Image
                  source={{ uri: provider.id_card_photo }}
                  resizeMode="contain"
                  style={{ borderRadius: 75, width: 120, height: 120 }}
                />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: 250,
                    height: 220,
                    alignItems: "center",
                    padding: 30,
                  }}
                >
                  {/* name  */}
                  <Text
                    style={{
                      flexWrap: "wrap",
                      fontSize: 24,
                      textAlign: "center",
                      color: "#17041c",
                      fontWeight: "700",
                      textShadowColor: "#e0c0f0",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                      letterSpacing: 1,
                      lineHeight: 28,
                    }}
                  >
                    {provider.first_name + " " + provider.last_name}
                  </Text>
                  <View style={{ alignItems: "center", marginTop: 10, gap: 8 }}>
                    {/* Service Location */}
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-start" }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={22}
                        color="#5e1675"
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          textAlign: "center",
                          color: "#1c032188",
                          fontWeight: "bold",
                          flexWrap: "wrap",
                          textShadowColor: "#d8a3ff",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 1,
                        }}
                      >
                        {provider.service_locations}
                      </Text>
                    </View>

                    {/* Languages */}
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="language-outline"
                        size={22}
                        color="#5e1675"
                        style={{ marginRight: 15 }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          textAlign: "center",
                          color: "#1c032188",
                          fontWeight: "bold",
                          flexWrap: "wrap",
                          textShadowColor: "#d8a3ff",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 1,
                        }}
                      >
                        {provider.languages}
                      </Text>
                    </View>

                    {/* Years of Experience */}
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <FontAwesome
                        name="briefcase"
                        size={22}
                        color="#5e1675"
                        style={{ marginRight: 15 }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          textAlign: "center",
                          color: "#1c032188",
                          fontWeight: "bold",
                          flexWrap: "wrap",
                          textShadowColor: "#d8a3ff",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 1,
                        }}
                      >
                        {"Experience: " + provider.years_of_experience + " Y"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>

        {/* for feedback */}
        {/* for title */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
            marginTop: 50,
          }}
        >
          <MaterialIcons name="feedback" size={40} color="#500554ff" />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#5e1675",
              letterSpacing: 1,
              textShadowColor: "#e4c9f7",
              textShadowOffset: { width: 3, height: 3 },
              textShadowRadius: 3,
              marginRight: 160,
            }}
          >
            FEEDBACKS
          </Text>
        </View>
        {/* for the feedback cards */}
        <View
          style={{
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
            paddingVertical: 10,
            width: "100%",
          }}
        >
          {feedbackData
            .filter(
              (feedback) => feedback.service_id === serviceInfo.service_id
            )
            .map((feedback) => (
              <View
                key={feedback.feedback_id}
                style={{
                  width: "92%",
                  borderRadius: 12,
                }}
              >
                <LinearGradient
                  colors={["#f1ebf6ff", "#dfbfe2ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  {/* Header: User icon + name */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 6,
                      gap: 10,
                    }}
                  >
                    <FontAwesome name="user-circle" size={36} color="#7b1fa2" />
                    <Text
                      style={{
                        marginLeft: 8,
                        fontSize: 18,
                        fontWeight: "900",
                        color: "#3b0a4f",
                        fontStyle: "italic",
                      }}
                    >
                      {feedback.user_name}
                    </Text>
                    {/* Date */}
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#470a45ff",
                        fontWeight: "500",
                        marginLeft: 50,
                      }}
                    >
                      {feedback.date_time}
                    </Text>
                  </View>

                  {/* Comment */}
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#4e1966",
                      marginTop: 10,
                      lineHeight: 20,
                      fontWeight: "500",
                    }}
                  >
                    {feedback.comment}
                  </Text>

                  {/* Rating */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    {getStars(feedback.rating)}
                  </View>
                </LinearGradient>
              </View>
            ))}
        </View>
        {/* for the feedback button */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("login")}
          >
            <Text style={styles.buttonText}>Give Your Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#f7eaf9ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
  },
  text: {
    color: "#7b3685ff",
    fontSize: 22,
    fontWeight: "900",
    paddingLeft: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#7b117fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
