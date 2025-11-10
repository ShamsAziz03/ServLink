import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Foundation } from "@expo/vector-icons";

const myTasker = () => {
  return (
    <View>
      <Link href="/questions" style={{ paddingTop: 40, paddingLeft: 10 }}>
        <Foundation name="list" size={40} color="black" />
      </Link>
      <Text style={{ paddingTop: 50 }}>myTasker</Text>
    </View>
  );
};

export default myTasker;
