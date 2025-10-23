import { Link } from "expo-router";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.png";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";

import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import Card from "../../components/card";

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
        <Text key={i} style={{ fontSize: 27, color: "#dee90dff" }}>
          ★
        </Text>
      );
    }
  }
  return stars;
}

const home = () => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get("window").width;
  const list = [
    {
      id: 1,
      view: (
        <View style={{ padding: 20 }}>
          {/* to put circles */}
          <View
            style={[
              {
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: 120,
              },
              {
                top: 10,
                right: 250,
                backgroundColor: "rgba(171, 102, 186, 0.3)",
              },
            ]}
          />
          <View
            style={[
              {
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
              },
              { top: 10, left: 320, backgroundColor: "rgba(58, 6, 81, 0.4)" },
            ]}
          />
          {/* now texts */}

          <Text
            style={{
              color: "#2f154aff",
              fontSize: 30,
              paddingBottom: 10,
              fontFamily: "Inter-Black",
            }}
          >
            Trusted help, when and how you need it.
          </Text>
          <Text
            style={{
              color: "#3b2d4bff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ServLink connects you with trusted local professionals for every
            task. Book in minutes, chat directly, and get things done.
          </Text>
        </View>
      ),
    },
    {
      id: 2,
      view: (
        <View style={styles.slide}>
          <Image
            source={require("../../assets/pic1.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Quick Help at Your Doorstep</Text>
          <Text style={styles.desc}>
            From cleaning to tech repair — find trusted experts nearby in
            minutes.
          </Text>
        </View>
      ),
    },
    {
      id: 3,
      view: (
        <View style={styles.slide}>
          <Image
            source={require("../../assets/pic2.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Reliable Professionals</Text>
          <Text style={styles.desc}>
            Every worker is verified, reviewed, and ready to get the job done.
          </Text>
        </View>
      ),
    },
  ];
  const categories = [
    { id: 1, name: "Handyman", img: require("../../assets/handyman.png") },
    {
      id: 2,
      name: "Agriculture",
      img: require("../../assets/agriculture.png"),
    },
    { id: 3, name: "Cleaning", img: require("../../assets/cleaning.png") },
    {
      id: 4,
      name: "Furniture Moving",
      img: require("../../assets/furnituremoving.png"),
    },
    { id: 5, name: "Childcare", img: require("../../assets/childcare.png") },
    { id: 6, name: "Pet Care", img: require("../../assets/petcare.png") },
    {
      id: 7,
      name: "IT / Computer Services",
      img: require("../../assets/itservices.png"),
    },
    {
      id: 8,
      name: "Private Lessons",
      img: require("../../assets/privatelessons.png"),
    },
  ];
  const suggested = [
    {
      id: 1,
      title: "Assemble furniture",
      category: "Handyman",
      img: require("../../assets/Assemble_and_install_furniture2.jpg"),
      price: 50,
    },
    {
      id: 2,
      title: "Baby Sitting",
      category: "Children",
      img: require("../../assets/Babysitting.jpg"),
      price: 20,
    },
    {
      id: 3,
      title: "Helping disabled at home",
      category: "Home Help",
      img: require("../../assets/Helping_elderly_disabled_at_home.jpg"),
      price: 70,
    },
    {
      id: 4,
      title: "Full Furniture Relocation",
      category: "Furniture Moving Services",
      img: require("../../assets/Full_furniture_relocation.jpg"),
      price: 50,
    },
  ];

  const mostBooked = [
    {
      id: 1,
      title: "Installing Electrical Sockets",
      category: "Handyman",
      img: require("../../assets/Installing_electrical_sockets.jpg"),
      price: 30,
    },
    {
      id: 2,
      title: "Pipe Work (Plumbing)",
      category: "Handyman",
      img: require("../../assets/pipe_work (plumbing).jpg"),
      price: 40,
    },
    {
      id: 3,
      title: "Academic tutoring (math/science)",
      category: "Private Lessons",
      img: require("../../assets/private_language_lessons.jpg"),
      price: 70,
    },
    {
      id: 4,
      title: "Tree Trimming",
      category: "Gardening",
      img: require("../../assets/Tree_trimming.jpg"),
      price: 50,
    },
  ];

  const topProviders = [
    {
      id: 1,
      name: "Omar Khaled",
      serviceName: "Installing Electrical Sockets",
      img: require("../../assets/topProviders/icon1.jpg"),
      price: 30,
      rating: 4,
    },
    {
      id: 2,
      name: "Fadi Rami",
      serviceName: "Pipe Work (Plumbing)",
      img: require("../../assets/topProviders/icon2.jpg"),
      price: 40,
      rating: 5,
    },
    {
      id: 3,
      name: "Sara Haddad",
      serviceName: "Academic tutoring (math/science)",
      img: require("../../assets/topProviders/icon3.jpg"),
      price: 30,
      rating: 4,
    },
    {
      id: 4,
      name: "Ziad Fares",
      serviceName: "Tree Trimming",
      img: require("../../assets/topProviders/icon4.jpg"),
      price: 40,
      rating: 3,
    },
  ];
  const offers = [
    {
      id: 1,
      title: "Home Cleaning Discount",
      provider: "Omar Khaled",
      img: require("../../assets/discounts/20_sale.jpg"),
      oldPrice: 60,
      newPrice: 12,
    },
    {
      id: 2,
      title: "Furniture Assembly Offer",
      provider: "Samer Ahmad",
      img: require("../../assets/discounts/50_sale.jpg"),
      oldPrice: 80,
      newPrice: 40,
    },
    {
      id: 3,
      title: "Gardening & Lawn Care Deal",
      provider: "Sara Zahi",
      img: require("../../assets/discounts/30_sale.jpg"),
      oldPrice: 100,
      newPrice: 70,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: insets.top,
      }}
    >
      {/* the first view - header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={30} color="#601d77ff" />
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Ionicons name="search" size={30} color="#601d77ff" />
      </View>

      {/* the second view - full page  */}
      <View
        style={{
          flex: 6,
          backgroundColor: "#f7eaf9ff",
          padding: 10,
          paddingTop: 15,
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* view for image slider */}
          <View
            style={{ flex: 1, backgroundColor: "#f7eaf9ff", paddingTop: 20 }}
          >
            <Carousel
              width={width}
              height={300}
              data={list}
              autoPlay={true}
              pagingEnabled={true}
              scrollAnimationDuration={2500}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => item.view}
            />

            <View style={styles.dotsContainer}>
              {list.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : null,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* view for login-signup button */}
          <View
            style={{
              alignItems: "center",
              margin: 20,
              marginBottom: 40,
            }}
          >
            <Link
              href="/login"
              style={{
                marginTop: 20,
                backgroundColor: "#750d83ff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#e4e0e6ff",
                  fontSize: 20,
                  fontFamily: "Inter-Black",
                }}
              >
                Join Us Now
              </Text>
            </Link>
          </View>

          {/* view for catigories */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 30 }]}>
            Service Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 30,
              padding: 30,
              paddingHorizontal: 10,
            }}
          >
            {categories.map((category) => (
              <View
                key={category.id}
                style={{
                  alignItems: "center",
                  backgroundColor: "#f3e8f7ff",
                  padding: 20,
                  borderRadius: 10,
                  shadowColor: "#593962ff",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.6,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    textAlign: "center",
                    color: "#4d045d88",
                    fontWeight: "bold",
                  }}
                >
                  {category.name}
                </Text>
                <Image source={category.img} resizeMode="contain" />
                <Link
                  href="/login"
                  style={{
                    marginTop: 20,
                    padding: 5,
                    backgroundColor: "#893696ff",
                    borderRadius: 10,
                    textAlign: "center",
                    width: width / 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#e4e0e6ff",
                      fontSize: 16,
                      fontFamily: "Inter-Black",
                    }}
                  >
                    Book
                  </Text>
                </Link>
              </View>
            ))}
          </ScrollView>

          {/* view for suggested for u */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Suggested for you
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 40,
              padding: 40,
              paddingHorizontal: 30,
            }}
          >
            {suggested.map((suggest) => (
              <Pressable
                key={suggest.id}
                onPress={() => {
                  console.log("test");
                }}
              >
                <Card
                  id={suggest.id}
                  img={suggest.img}
                  title={suggest.title}
                  category={suggest.category}
                  price={suggest.price}
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* view for most booked services */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Most Booked Services
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 40,
              padding: 40,
              paddingHorizontal: 30,
            }}
          >
            {mostBooked.map((book) => (
              <Pressable
                key={book.id}
                onPress={() => {
                  console.log("test");
                }}
              >
                <Card
                  id={book.id}
                  img={book.img}
                  title={book.title}
                  category={book.category}
                  price={book.price}
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* view for top rated providers */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Top Rated Providers
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 40,
              padding: 40,
              paddingHorizontal: 30,
            }}
          >
            {topProviders.map((provider) => (
              <View
                key={provider.id}
                style={{
                  alignItems: "center",
                  backgroundColor: "#f3e8f7ff",
                  padding: 20,
                  borderRadius: 10,
                  shadowColor: "#593962ff",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.8,
                  shadowRadius: 16,
                  elevation: 15,
                }}
              >
                <Image
                  source={provider.img}
                  resizeMode="contain"
                  style={{ borderRadius: 75, width: 100, height: 100 }}
                />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: 250,
                    height: 220,
                    alignItems: "center",
                  }}
                >
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
                    {provider.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "#1c032188",
                      fontWeight: "bold",
                      paddingTop: 10,
                      flexWrap: "wrap",
                      textShadowColor: "#d8a3ff",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    {provider.serviceName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      color: "#653470",
                      fontWeight: "500",
                      marginTop: 3,
                      letterSpacing: 0.5,
                      backgroundColor: "#f0e0f5",
                      borderRadius: 6,
                      paddingHorizontal: 6,
                      paddingVertical: 5,
                      alignSelf: "center",
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}
                  >
                    {provider.price + " $"}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {getStars(provider.rating)}
                  </View>
                  <Link
                    href="/"
                    style={{
                      marginTop: 10,
                      backgroundColor: "#893696ff",
                      borderRadius: 10,
                      textAlign: "center",
                      width: width / 4,
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffffff",
                        fontWeight: "bold",
                        size: 16,
                      }}
                    >
                      Book
                    </Text>
                  </Link>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* view for sales */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Offers & Discount
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 40,
              padding: 40,
              paddingHorizontal: 30,
            }}
          >
            {offers.map((offer) => (
              <View
                key={offer.id}
                style={{
                  alignItems: "center",
                  backgroundColor: "#f3e8f7ff",
                  padding: 20,
                  borderRadius: 10,
                  shadowColor: "#593962ff",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.8,
                  shadowRadius: 16,
                  elevation: 15,
                }}
              >
                <Image
                  source={offer.img}
                  resizeMode="contain"
                  style={{ borderRadius: 60, width: 100, height: 100 }}
                />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: 250,
                    height: 200,
                    alignItems: "center",
                  }}
                >
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
                    {offer.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "#1c032188",
                      fontWeight: "bold",
                      paddingTop: 10,
                      flexWrap: "wrap",
                      textShadowColor: "#d8a3ff",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    {offer.provider}
                  </Text>
                  <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
                    <Text
                      style={{
                        fontSize: 24,
                        textAlign: "center",
                        color: "#6d377588",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                        textDecorationLine: "line-through",
                      }}
                    >
                      {offer.oldPrice + " $"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        textAlign: "center",
                        color: "#1e022588",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                        textShadowColor: "#d8a3ff",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                      }}
                    >
                      {offer.newPrice + " $"}
                    </Text>
                  </View>

                  <Link
                    href="/"
                    style={{
                      marginTop: 10,
                      backgroundColor: "#893696ff",
                      borderRadius: 10,
                      textAlign: "center",
                      width: width / 4,
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffffff",
                        fontWeight: "bold",
                        size: 16,
                      }}
                    >
                      Book
                    </Text>
                  </Link>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* our social media  */}
          <View style={{ paddingTop: 40, paddingBottom: 10 }}>
            <Text
              style={{
                color: "#3b2d4bff",
                fontSize: 24,
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              FOLLOW US ON
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                margin: 20,
                justifyContent: "space-evenly",
              }}
            >
              <Link href="https://www.instagram.com/">
                <Ionicons name="logo-instagram" size={35} color="#57096fff" />
              </Link>
              <Link href="https://www.youtube.com/">
                <Ionicons name="logo-youtube" size={35} color="#57096fff" />
              </Link>
              <Link href="https://www.facebook.com/">
                <Ionicons name="logo-facebook" size={35} color="#57096fff" />
              </Link>
              <Link href="https://www.linkedin.com/">
                <Ionicons name="logo-linkedin" size={35} color="#57096fff" />
              </Link>
            </View>
            <Text
              style={{
                color: "#3b2d4bff",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              © 2025 SevLink. All rights reserved
            </Text>
          </View>
          {/* end of page */}
        </ScrollView>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f7eaf9ff",
  },
  logo: {
    width: 130,
    height: 100,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "90%",
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    textAlign: "center",
  },
  desc: {
    fontSize: 16,
    color: "#6a5c7b",
    textAlign: "center",
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c287c8ff",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#37043aff",
    width: 10,
    height: 10,
  },
});
