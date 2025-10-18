import { View, Text } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";

const tasks = () => {
  return (
    <View>
      <Link href="/" style={{ paddingTop: 40, paddingLeft: 10 }}>
        <Foundation name="list" size={40} color="black" />
      </Link>
      <Text style={{ paddingTop: 50 }}>tasks</Text>
    </View>
  );
};

export default tasks;
