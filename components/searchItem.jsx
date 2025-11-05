import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from "react-native";

const SearchItem = ({ id, title, img, category, description }) => {
  const width = Dimensions.get("window").width;

  return (
    <Pressable
      key={id}
      onPress={() => {
        console.log(title);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderColor: "#680260ff",
          borderWidth: 0.5,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Image
          source={img}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            margin: 10,
          }}
        />
        <View style={[styles.texts, { width: width / 1.7 }]}>
          <Text
            style={{
              fontSize: 20,
              color: "#1d011fff",
              fontWeight: "bold",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: "#4a034fff",
              fontWeight: "bold",
            }}
          >
            {category}
          </Text>
          <Text style={{ fontSize: 15, color: "#690370ff" }}>
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  texts: {
    flexDirection: "column",
    padding: 10,
    gap: 6,
  },
});
