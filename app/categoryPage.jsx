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
import { useNavigation } from "@react-navigation/native";

const CategoryPage = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();
  function getStars(rating) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating - 1 < i) {
        stars.push(
          <Text key={i} style={{ fontSize: 27, color: "#000000ff" }}>
            ☆
          </Text>
        );
      } else {
        stars.push(
          <Text key={i} style={{ fontSize: 27, color: "#660468ff" }}>
            ★
          </Text>
        );
      }
    }
    return stars;
  }

  const [activeCategory, setActiveCategory] = useState(1);
  const navigation = useNavigation();

  const categoriesData = [
    {
      category_id: 1,
      name: "Handyman",
      icon: "hammer",
    },
    {
      category_id: 2,
      name: "Agriculture",
      icon: "leaf",
    },
    {
      category_id: 3,
      name: "Cleaning",
      icon: "sparkles",
    },
    {
      category_id: 4,
      name: "Furniture Moving",
      icon: "cube",
    },
    {
      category_id: 5,
      name: "Child Care",
      icon: "accessibility",
    },
    {
      category_id: 6,
      name: "Pet Care",
      icon: "paw",
    },
    {
      category_id: 7,
      name: "IT / Computer Services",
      icon: "laptop",
    },
    {
      category_id: 8,
      name: "Private Lessons",
      icon: "book",
    },
  ];

  const servicesData = [
    {
      service_id: 1,
      category_id: 1,
      title: "Assemble Furniture",
      description:
        "Professional help assembling and installing furniture at your home.",
      image: "http://10.0.2.2:5000/assets/Assemble_and_install_furniture2.jpg",
      price: 20.0,
    },
    {
      service_id: 2,
      category_id: 5,
      title: "Baby Sitting",
      description: "Reliable babysitting services for your children.",
      image: "http://10.0.2.2:5000/assets/Babysitting.jpg",
      price: 30.0,
    },
    {
      service_id: 3,
      category_id: 3,
      title: "Helping Disabled at Home",
      description: "Assistance and care for the elderly or disabled at home.",
      image: "http://10.0.2.2:5000/assets/Helping_elderly_disabled_at_home.jpg",
      price: 40.0,
    },
    {
      service_id: 4,
      category_id: 4,
      title: "Full Furniture Relocation",
      description: "Complete moving service for furniture and household items.",
      image: "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
      price: 20.0,
    },
    {
      service_id: 5,
      category_id: 1,
      title: "Installing Electrical Sockets",
      description:
        "Installation of electrical sockets by a professional handyman.",
      image: "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
      price: 80.0,
    },
    {
      service_id: 6,
      category_id: 1,
      title: "Pipe Work (Plumbing)",
      description: "Plumbing and pipe work services for homes and offices.",
      image: "http://10.0.2.2:5000/assets/pipe_work (plumbing).jpg",
      price: 90.0,
    },
    {
      service_id: 7,
      category_id: 8,
      title: "Academic Tutoring (Math/Science)",
      description: "Private academic lessons in math and science subjects.",
      image: "http://10.0.2.2:5000/assets/private_language_lessons.jpg",
      price: 50.0,
    },
  ];
  const feedbackData = [
    {
      feedback_id: 1,
      user_name: "ahmad ali",
      category_id: 1,
      rating: 3,
      comment: "Furniture assembly was okay, met expectations.",
      date_time: "2025-10-18 12:00:00",
    },
    {
      feedback_id: 2,
      user_name: "ahmad ali",
      category_id: 1,
      rating: 4,
      comment: "Sink fixed well, minor delay in arrival.",
      date_time: "2025-10-13 09:00:00",
    },
    {
      feedback_id: 3,
      user_name: "ahmad ali",
      category_id: 4,
      rating: 5,
      comment: "Backyard looks amazing after tree trimming, highly satisfied!",
      date_time: "2025-10-27 10:30:00",
    },
    {
      feedback_id: 4,
      category_id: 6,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      category_id: 1,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      category_id: 2,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
    },
    {
      feedback_id: 4,
      category_id: 3,
      user_name: "ahmad ali",
      rating: 5,
      comment: "Furniture assembled quickly and safely, excellent work!",
      date_time: "2025-10-22 14:00:00",
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
        <Link href="/home">
          <Ionicons name="arrow-back-outline" size={35} color={"#7b3685ff"} />
        </Link>
        <Text style={styles.text}>Categories</Text>
        <Link
          href={{
            pathname: "/search",
            params: { pageToBack: "/categoryPage" },
          }}
        >
          <Ionicons name="search" size={32} color="#7b3685ff" />
        </Link>
      </View>
      {/* for categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          borderColor: "#bfbcbcff",
          borderWidth: 1,
          borderTopColor: "#bfbcbcff",
          borderTopWidth: 1,
          height: 120,
          padding: 5,
          paddingBottom: 10,
          borderBottomColor: "#bfbcbcff",
          borderBottomWidth: 30,
        }}
      >
        {categoriesData.map((category) => {
          const isActive = activeCategory === category.category_id;

          return (
            <Pressable
              key={category.category_id}
              onPress={() => setActiveCategory(category.category_id)}
              style={{
                alignItems: "center",
                marginHorizontal: 15,
                borderBottomWidth: isActive ? 3 : 0,
                borderBottomColor: isActive ? "#7b3685ff" : "transparent",
                paddingBottom: 6,
              }}
            >
              <Ionicons
                name={category.icon}
                size={35}
                color={isActive ? "#7b3685ff" : "#878686ff"}
              />
              <Text
                style={{
                  fontSize: 15,
                  marginTop: 6,
                  color: isActive ? "#7b3685ff" : "#727171ff",
                  fontWeight: isActive ? "800" : "500",
                }}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* page for each category */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          padding: 10,
          paddingVertical: 20,
        }}
      >
        {/* identification for the category */}
        <LinearGradient
          colors={["#f8e1fbff", "#bf73c6ff"]} // purple gradient
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
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons
              name="hammer"
              size={40}
              color="#7b3685ff"
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                letterSpacing: 1,
                color: "#5f0557ff",
                textShadowColor: "#c7add4ff",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 2,
              }}
            >
              HANDY MAN
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#763f78ff",
              textAlign: "center",
              fontWeight: "700",
              letterSpacing: 0.5,
              textShadowColor: "#47055cff",
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 1,
            }}
          >
            Services related to handyman work.
          </Text>
        </LinearGradient>
        {/* for services */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          {servicesData
            .filter((service) => service.category_id === activeCategory)
            .map((service) => (
              <Pressable
                key={service.service_id}
                style={{
                  width: "48%",
                  margin: 2,
                  borderRadius: 12,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  alignItems: "center",
                  marginBottom: 12,
                }}
                onPress={() => {
                  console.log(service.title);
                }}
              >
                {/* Gradient background */}
                <LinearGradient
                  colors={["#fdfbff", "#f1dbf4ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flex: 1,
                    width: "100%",
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* Service Image */}

                  <Image
                    source={{ uri: service.image }}
                    style={{
                      width: "100%",
                      height: 120,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />

                  {/* Service Title */}
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#5f0557ff",
                      textAlign: "center",
                      paddingTop: 15,
                      fontWeight: "900",
                      textShadowColor: "#c595ddff",
                      textShadowOffset: { width: 1.5, height: 1.5 },
                      textShadowRadius: 2,
                    }}
                  >
                    {service.title}
                  </Text>

                  {/* Description */}
                  {/* <Text
                    style={{
                      paddingTop: 5,
                      fontSize: 15,
                      textAlign: "center",
                      color: "#430851ff",
                      fontWeight: "400",
                      letterSpacing: 0.5,
                      textShadowColor: "#d8a3ff",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                      paddingBottom: 10,
                    }}
                  >
                    {service.description}
                  </Text> */}
                  {/* price */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        color: "#653470",
                        fontWeight: "900",
                        backgroundColor: "#e5cfecff",
                        borderRadius: 6,
                        alignSelf: "center",
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        padding: 5,
                      }}
                    >
                      {"Start at: " + service.price + " ₪"}
                    </Text>
                    <Pressable
                      onPress={() => {
                        console.log(service.title);
                      }}
                    >
                      <FontAwesome
                        name="shopping-cart"
                        size={23}
                        color="#f3eeeeff"
                        style={{
                          backgroundColor: "#42013bff",
                          padding: 6,
                          borderRadius: 50,
                        }}
                      />
                    </Pressable>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
        </View>

        {/* for feedback */}
        {/* for title */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
            marginTop: 30,
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
            .filter((feedback) => feedback.category_id === activeCategory)
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
            onPress={() => navigation.navigate("Login")}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
  },
  text: {
    color: "#7b3685ff",
    fontSize: 30,
    fontWeight: "bold",
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
