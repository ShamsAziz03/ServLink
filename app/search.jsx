import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoView from "../components/logoView";
import SearchItem from "../components/searchItem";
import { useLocalSearchParams } from "expo-router";

const search = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const { pageToBack } = useLocalSearchParams();

  const searchResults = [
    {
      id: 1,
      title: "Installing Electrical Sockets",
      description: "Professional socket installation for homes and offices.",
      category: "Handyman",
      img: require("../assets/Installing_electrical_sockets.jpg"),
      link: "/service/installing-electrical-sockets",
    },
    {
      id: 2,
      title: "Pipe Work (Plumbing)",
      description:
        "Reliable plumbing and pipe maintenance for bathrooms and kitchens.",
      category: "Handyman",
      img: require("../assets/pipe_work (plumbing).jpg"),
      link: "/service/pipe-work-plumbing",
    },
    {
      id: 3,
      title: "Baby Sitting",
      description:
        "Experienced and caring babysitters for infants and children.",
      category: "Childcare",
      img: require("../assets/Babysitting.jpg"),
      link: "/service/babysitting",
    },
    {
      id: 4,
      title: "Full Furniture Relocation",
      description:
        "Complete moving service — furniture disassembly, transport, and setup.",
      category: "Furniture Moving",
      img: require("../assets/Full_furniture_relocation.jpg"),
      link: "/service/full-furniture-relocation",
    },
    {
      id: 5,
      title: "Academic Tutoring (Math/Science)",
      description: "Private one-on-one tutoring with certified instructors.",
      category: "Private Lessons",
      img: require("../assets/private_language_lessons.jpg"),
      link: "/service/academic-tutoring-math-science",
    },
    {
      id: 6,
      title: "Tree Trimming",
      description:
        "Tree cutting and maintenance services for gardens and outdoor spaces.",
      category: "Agriculture",
      img: require("../assets/Tree_trimming.jpg"),
      link: "/service/tree-trimming",
    },
    {
      id: 7,
      title: "Furniture Assembly Offer",
      description: "Limited-time 50% off furniture assembly and installation.",
      category: "Handyman",
      img: require("../assets/discounts/50_sale.jpg"),
      link: "/offers/furniture-assembly",
    },
  ];

  return (
    <View
      style={[
        styles.fullView,
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <LogoView pageToBack={pageToBack} />
      <View style={styles.searchBar}>
        <Ionicons
          name="search-sharp"
          size={30}
          color={"#63036aff"}
          style={{ padding: 10 }}
        />
        <TextInput
          placeholder="What's in your mind ..."
          value={value}
          onChangeText={setValue}
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: "bold",
            paddingVertical: 10,
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => setValue("")}
            style={{ padding: 10 }}
          >
            <Ionicons name="close-circle" size={22} color="#63036aff" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        style={{
          padding: 20,
          paddingHorizontal: 20,
          gap: 20,
          marginBottom: 10,
        }}
        renderItem={({ item }) => {
          if (value === "") {
            return (
              <SearchItem
                id={item.id}
                title={item.title}
                img={item.img}
                category={item.category}
                description={item.description}
              />
            );
          }
          if (
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.category.toLowerCase().includes(value.toLowerCase())
          ) {
            return (
              <SearchItem
                id={item.id}
                title={item.title}
                img={item.img}
                category={item.category}
                description={item.description}
              />
            );
          }
        }}
      />
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 20,
    backgroundColor: "#f7eaf9ff",
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderRadius: 10,
    marginHorizontal: 20,
    borderColor: "#3a0350ff",
    borderWidth: 1,
  },
  texts: {
    flexDirection: "column",
    padding: 10,
    gap: 6,
  },
});
