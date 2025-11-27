import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

const HeaderLogoReturn = ({ linkToReturn, title, goToService = false }) => {
  const navigation = useNavigation();
  const { currentService } = useContext(AppContext);
  const handlePress = () => {
    if (goToService) {
      navigation.navigate(linkToReturn, { serviceInfo: currentService });
    } else {
      navigation.navigate(linkToReturn);
    }
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          handlePress();
        }}
      >
        <Ionicons name="arrow-back-outline" size={35} color={"#7b3685ff"} />
      </Pressable>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default HeaderLogoReturn;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 30,
  },
  text: {
    color: "#7b3685ff",
    fontSize: 22,
    fontWeight: "900",
    paddingLeft: 20,
    textAlign: "center",
  },
});
