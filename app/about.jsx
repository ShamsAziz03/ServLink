import { Link } from "expo-router";
import { Text, View } from "react-native";

const About = () => {
  return (
    <View>
      <Text style={{ paddingTop: 50, fontSize: 24, fontWeight: "bold" }}>
        About
      </Text>
      <Link href="/" style={{ color: "blue", marginVertical: 10 }}>
        Go to Home
      </Link>
    </View>
  );
};

export default About;
