import Map from "../components/map";
import SearchBox from "../components/searchBox";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

const UserLocation = () => {
  const [selectPosition, setSelectPosition] = useState({});
  const { currentService } = useContext(AppContext);
  const navigation = useNavigation();

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
        <Pressable
          style={{ paddingTop: 40, paddingLeft: 10 }}
          onPress={() => navigation.navigate("questions")}
        >
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
        </Pressable>
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
