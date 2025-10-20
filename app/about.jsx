import { Link } from "expo-router";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const width = Dimensions.get("window").width;

  const list = [
    { id: 1, title: "Learn React Native", desc: "Build apps with ease." },
    { id: 2, title: "Master Reanimated", desc: "Add smooth animations." },
    { id: 3, title: "Use Expo Router", desc: "Navigate like a pro." },
    { id: 4, title: "Optimize UI", desc: "Design responsive layouts." },
    { id: 5, title: "Deploy Fast", desc: "Publish your app efficiently." },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 50 }}>
      {/* <View>
        <Text style={{ paddingTop: 50, fontSize: 24, fontWeight: "bold" }}>
          About
        </Text>
        <Link href="/" style={{ color: "blue", marginVertical: 10 }}>
          Go to Home
        </Link>
      </View> */}

      <Carousel
        width={width}
        height={width / 2}
        data={list}
        autoPlay={true}
        pagingEnabled={true}
        scrollAnimationDuration={1500}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.CarouselItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
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
  );
};

export default About;

const styles = StyleSheet.create({
  CarouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  desc: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
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
