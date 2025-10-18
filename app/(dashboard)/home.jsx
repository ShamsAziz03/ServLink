import { View, Text } from "react-native";
import { Link } from "expo-router";

const home = () => {
  return (
    <View>
      <Text style={{ paddingTop: 50 }}>home</Text>
      <Link href="/">index page </Link>
    </View>
  );
};

export default home;
