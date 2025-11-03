import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import Card from "../../components/card";
import Notification from "../../components/notification";

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
  const [visible, setVisibility] = useState(false);

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

  //user Id
  const [userId, setUserId] = useState(1);

  //for fetch categories
  const [categoriesData, setcategoriesData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/homeInfo/categories");
      const fetchedData = await response.json();
      setcategoriesData(fetchedData[0]);
      console.log("Response:", fetchedData[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //for fetch offers
  const [offersData, setOffersData] = useState([]);
  const fetchOffers = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/homeInfo/offers");
      const fetchedDataOffers = await response.json();
      setOffersData(fetchedDataOffers[0]);
      console.log("Response:", fetchedDataOffers[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //for fetch top providers
  const [topProviders, setTopProviders] = useState([]);
  const fetchTopProviders = async () => {
    try {
      const response = await fetch(
        "http://10.0.2.2:5000/homeInfo/topProviders"
      );
      const fetchedData = await response.json();
      setTopProviders(fetchedData);
      console.log("top providers:", fetchedData);
    } catch (error) {
      console.error("Error fetching top providers:", error);
    }
  };

  //for most booked services
  const [mostBooked, setMostBooked] = useState([]);
  const fetchMostBooked = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/homeInfo/mostBooked");
      const fetchedData = await response.json();
      setMostBooked(fetchedData);
      console.log("most booked:", fetchedData);
    } catch (error) {
      console.error("Error fetching most booked:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
    fetchOffers();
    fetchTopProviders();
    fetchMostBooked();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: insets.top,
      }}
    >
      <Notification
        user_id={userId}
        visible={visible}
        onClose={() => setVisibility(false)}
      />
      {/* the first view - header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            setVisibility((prev) => !prev);
          }}
        >
          <Ionicons name="notifications" size={30} color="#601d77ff" />
        </Pressable>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Link href="/search">
          <Ionicons name="search" size={30} color="#601d77ff" />
        </Link>
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
            {categoriesData.map((category) => (
              <View
                key={category.category_id}
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
                <Image
                  source={{ uri: category.cover_image }}
                  resizeMode="contain"
                  style={{ width: 200, height: 200 }}
                />
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
                key={book.service_id}
                onPress={() => {
                  console.log("test");
                }}
              >
                <Card
                  id={book.service_id}
                  img={book.service_image}
                  title={book.service_name}
                  category={book.category_name}
                  price={book.base_price}
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
                key={provider.provider_id}
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
                  source={{ uri: provider.id_card_photo }}
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
                    {provider.first_name + " " + provider.last_name}
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
                    {provider.name}
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
                    {provider.base_price + " $"}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {getStars(provider.score)}
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
            {offersData.map((offer) => (
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
                  source={{ uri: offer.img_url }}
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
                    {offer.provider_name}
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
                      {offer.old_price + " $"}
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
                      {offer.new_price + " $"}
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
