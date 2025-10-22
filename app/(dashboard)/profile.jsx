import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Foundation } from "@expo/vector-icons";

const profile = () => {
  return (
    <View>
      <Link href="/" style={{ paddingTop: 40, paddingLeft: 10 }}>
        <Foundation name="list" size={40} color="black" />
      </Link>
      <Text style={{ paddingTop: 50 }}>profile</Text>
      <Text style={{ paddingTop: 50 }}>go to popular questions page </Text>
      <Text style={{ paddingTop: 50 }}>go to about us page</Text>
      {/* popular questions */}
      {/* about us  */}
    </View>
  );
};

export default profile;
