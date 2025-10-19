import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> test </Text>
      <Text style={{ fontSize: 15 }}> shams aziz</Text>
      <Link href="/home">Go to Home</Link>
      <Link href="/about">Go to About</Link>
       <Link href="/login">Go to Login</Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }, //rand
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
});
