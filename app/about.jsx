import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const About = () => {
  return (
    <View>
      <Text style={{ paddingTop: 50 }}>About</Text>
      <Link href="/">Go to Home</Link>
    </View>
  );
};

export default About;
