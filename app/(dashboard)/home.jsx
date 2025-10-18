import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Foundation } from "@expo/vector-icons";

const home = () => {
  return (
    <View>
      <Link href="/" style={{ paddingTop: 40, paddingLeft: 10 }}>
        <Foundation name="list" size={40} color="black" />
      </Link>
      <Text style={{ paddingTop: 40 }}>home</Text>
      <Link href="/">index page </Link>
    </View>
  );
};

export default home;
