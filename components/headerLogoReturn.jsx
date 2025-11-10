import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HeaderLogoReturn = ({ linkToRetrun, title }) => {
  return (
    <View style={styles.header}>
      <Link href={linkToRetrun}>
        <Ionicons name="arrow-back-outline" size={35} color={"#7b3685ff"} />
      </Link>
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
