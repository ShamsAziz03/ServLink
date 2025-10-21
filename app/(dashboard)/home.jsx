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
} from "react-native";

import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";

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
    { name: "Handyman", img: require("../../assets/handyman.png") },
    { name: "Agriculture", img: require("../../assets/agriculture.png") },
    { name: "Cleaning", img: require("../../assets/cleaning.png") },
    {
      name: "Furniture Moving",
      img: require("../../assets/furnituremoving.png"),
    },
    { name: "Childcare", img: require("../../assets/childcare.png") },
    { name: "Pet Care", img: require("../../assets/petcare.png") },
    {
      name: "IT / Computer Services",
      img: require("../../assets/itservices.png"),
    },
    {
      name: "Private Lessons",
      img: require("../../assets/privatelessons.png"),
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
            What's in your mind?
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
            {categories.map((category, index) => (
              <View
                key={index}
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
          <Text style={[styles.title, { textAlign: "left", paddingTop: 30 }]}>
            Suggested for you
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
            {categories.map((category, index) => (
              <View
                key={index}
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

          {/* other page content */}
          <Text style={{ fontSize: 42 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          {/*  */}
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
