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

function getStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating - 1 < i) {
      stars.push(<Text style={{ fontSize: 27, color: "#000000ff" }}>☆</Text>);
    } else {
      stars.push(<Text style={{ fontSize: 27, color: "#dee90dff" }}>★</Text>);
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
            task — home, tech, care, or more. Book in minutes, chat directly,
            and get things done quickly and confidently.
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
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: insets.top,
      }}
    >
      {/* the first view - header */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7eaf9ff",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ paddingTop: 40, paddingLeft: 10 }}>
          <Ionicons name="notifications" size={35} color="#57096fff" />
        </Link>
        <Image source={Logo} style={{ marginTop: 25 }} />
        <Ionicons
          name="search"
          size={35}
          color="#57096fff"
          style={{ marginTop: 40, paddingRight: 15 }}
        />
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
        <ScrollView>
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
            showsHorizontalScrollIndicator={true}
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
                    backgroundColor: "#750d83ff",
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
            showsHorizontalScrollIndicator={true}
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
                <View
                  key={suggest.id}
                  style={{
                    alignItems: "center",
                    backgroundColor: "#f4e4feff",
                    padding: 20,
                    borderRadius: 10,
                    shadowColor: "#593962ff",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.8,
                    shadowRadius: 16,
                    elevation: 15,
                  }}
                >
                  <Image source={suggest.img} resizeMode="contain" />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      width: 250,
                      height: 200,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        textAlign: "center",
                        color: "#17041c88",
                        fontWeight: "bold",
                        flexWrap: "wrap",
                      }}
                    >
                      {suggest.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        color: "#5b106b88",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {suggest.category}
                    </Text>
                    <Text
                      style={{
                        fontSize: 19,
                        textAlign: "center",
                        color: "#65347088",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {"Projects Starting at : " + suggest.price + " $"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* view for most booked services */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Most Booked Services
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
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
                <View
                  key={book.id}
                  style={{
                    alignItems: "center",
                    backgroundColor: "#f4e4feff",
                    padding: 20,
                    borderRadius: 10,
                    shadowColor: "#593962ff",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.8,
                    shadowRadius: 16,
                    elevation: 15,
                  }}
                >
                  <Image source={book.img} resizeMode="contain" />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      width: 250,
                      height: 200,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        textAlign: "center",
                        color: "#17041c88",
                        fontWeight: "bold",
                        flexWrap: "wrap",
                      }}
                    >
                      {book.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        color: "#5b106b88",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {book.category}
                    </Text>
                    <Text
                      style={{
                        fontSize: 19,
                        textAlign: "center",
                        color: "#65347088",
                        fontWeight: "bold",
                        paddingTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {"Projects Starting at : " + book.price + " $"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* view for top rated providers */}
          <Text style={[styles.title, { textAlign: "left", paddingTop: 60 }]}>
            Top Rated Providers
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
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
                  backgroundColor: "#f4e4feff",
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
                  style={{ borderRadius: 100, width: 200, height: 150 }}
                />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: 250,
                    height: 230,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center",
                      color: "#17041c88",
                      fontWeight: "bold",
                      flexWrap: "wrap",
                    }}
                  >
                    {provider.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "#5b106b88",
                      fontWeight: "bold",
                      paddingTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {provider.serviceName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 19,
                      textAlign: "center",
                      color: "#5b106b88",
                      fontWeight: "bold",
                      paddingTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {"PRICE: " + provider.price + " $"}
                  </Text>
                  <View
                    style={{
                      paddingTop: 10,
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
                      backgroundColor: "#750d83ff",
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
                paddingBottom: 10,
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
