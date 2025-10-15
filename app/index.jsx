import { StyleSheet, Text, View } from "react-native";

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> test </Text>
      <Text> shams aziz</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
