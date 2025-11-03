import { StyleSheet, Text, View, Image } from "react-native";

const Card = ({ id, img, title, category }) => {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#f3e8f7ff",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        width: 280,
      }}
    >
      <Image
        source={
          typeof img === "string" && img.startsWith("http") ? { uri: img } : img
        }
        resizeMode="contain"
        style={styles.img}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          width: 250,
          height: 170,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            color: "#17041c",
            fontWeight: "700",
            textShadowColor: "#e0c0f0",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
            letterSpacing: 1,
            lineHeight: 28,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: "#5b106b",
            fontWeight: "600",
            textTransform: "uppercase", // makes it more "badge-like"
            letterSpacing: 2,
            paddingTop: 10,
            textShadowColor: "#d8a3ff",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
          }}
        >
          {category}
        </Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 200,
  },
});
