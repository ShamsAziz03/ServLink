import { StyleSheet, Text, View, Image } from "react-native";

const Card = ({ id, img, title, category, price }) => {
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

        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: "#653470",
            fontWeight: "500",
            marginTop: 15,
            letterSpacing: 0.5,
            backgroundColor: "#f0e0f5",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 5,
            alignSelf: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          {"Starting at: " + price + " ₪"}
        </Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 150,
  },
});
