import Map from "../components/map";
import SearchBox from "../components/searchBox";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

const UserLocation = () => {
  const [selectPosition, setSelectPosition] = useState({});
  return (
    <View style={styles.container}>
      <Map selectPosition={selectPosition} />

      <View style={styles.searchContainer}>
        <SearchBox
          selectPosition={selectPosition}
          setSelectPosition={setSelectPosition}
        />
      </View>
      <View style={styles.nextContainer}>
        <Link href="/questions" asChild>
          <Text
            style={{
              fontSize: 25,
              color: "#ffffffff",
              backgroundColor: "#6c1a72ff",
              fontWeight: "700",
              borderRadius: 15,
              padding: 10,
            }}
          >
            Next
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default UserLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  nextContainer: {
    position: "absolute",
    bottom: 30,
    right: 10,
    zIndex: 1000,
    padding: 20,
  },
});
