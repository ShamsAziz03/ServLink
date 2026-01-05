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
import React, { useEffect, useState, useContext } from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { AppContext } from "../context/AppContext";

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
  const { setCurrentService } = useContext(AppContext);

  const [serviceMetaData, setServiceMetaData] = useState([
    { base_price: 50, score: 3 },
  ]); //for price and rating
  const fetchserviceMetaData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:5000/servicePage/metaData/${serviceInfo.service_id}`
      );
      const fetchedData = await response.json();
      setServiceMetaData(fetchedData);
      console.log("Response of meta info:", fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [feedbackData, setFeedbackData] = useState([]);
  const fetchFeedbackData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:5000/servicePage/feedback/${serviceInfo.service_id}`
      );
      const fetchedData = await response.json();
      setFeedbackData(fetchedData);
      console.log("Response feedback:", fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [providers, setProviders] = useState([]);
  const fetchProviders = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:5000/servicePage/providers/${serviceInfo.service_id}`
      );
      const fetchedData = await response.json();
      setProviders(fetchedData);
      console.log("Response feedback:", fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchserviceMetaData();
    fetchFeedbackData();
    fetchProviders();
    setCurrentService(serviceInfo);
  }, []);

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
          colors={["#f6ddf8ff", "#fff0ffff"]} // purple gradient
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
                fontSize: 22,
                fontWeight: "700",
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
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                paddingBottom: 5,
              }}
            >
              {serviceInfo.description}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                letterSpacing: 0.5,
                color: "#5b0453ff",
                textShadowColor: "#c7add4ff",
                textShadowOffset: { width: 3, height: 3 },
                textShadowRadius: 2,
                marginTop: 10,
                marginLeft: 50,
                padding: 8,
              }}
            >
              {"Starting at: " + (serviceMetaData[0].base_price ?? 0) + " ₪"}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 15,
              }}
            >
              {getStars(serviceMetaData[0].score ?? 0)}
            </View>
          </View>
        </LinearGradient>
        {/* book now button */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("userLocation");
            }}
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
          {providers.map((provider) => (
            <View
              key={provider.provider_id}
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          {feedbackData.map((feedback) => (
            <View
              key={feedback.rating_id}
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
                    justifyContent: "space-evenly",
                    marginBottom: 6,
                    gap: 10,
                  }}
                >
                  <FontAwesome name="user-circle" size={36} color="#7b1fa2" />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "900",
                      color: "#3b0a4f",
                      fontStyle: "italic",
                    }}
                  >
                    {feedback.first_name + " " + feedback.last_name}
                  </Text>
                  {/* Date */}
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#470a45ff",
                      fontWeight: "500",
                      flexWrap: "wrap",
                    }}
                  >
                    {new Date(feedback.rated_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  {feedback.feedback_text}
                </Text>

                {/* Rating */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 6,
                  }}
                >
                  {getStars(feedback.score)}
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
