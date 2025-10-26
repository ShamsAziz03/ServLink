import Logo from "../assets/logo.png";
import { StyleSheet, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const LogoView = () => {
  return (
    <View style={styles.header}>
      <Link href="/home">
        {" "}
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color={"#63036aff"}
          style={{ padding: 10 }}
        />
      </Link>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

export default LogoView;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f7eaf9ff",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 60,
    marginLeft: 65,
  },
});
