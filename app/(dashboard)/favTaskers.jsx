import { View, Text, Pressable } from "react-native";
import React from "react";
import { Foundation } from "@expo/vector-icons";

const favTaskers = () => {
  return (
    <View>
      <Pressable style={{ paddingTop: 40, paddingLeft: 10 }}>
        <Foundation name="list" size={40} color="black" />
      </Pressable>
      <Text style={{ paddingTop: 50 }}>favTaskers</Text>
    </View>
  );
};

export default favTaskers;
