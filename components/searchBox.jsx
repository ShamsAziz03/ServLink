import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchBox = ({ selectPosition, setSelectPosition }) => {
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);

  const handleSearch = async () => {
    try {
      const params = {
        q: searchText,
        format: "json",
        addressdetails: 1,
        polygon_geojson: 0,
        countrycodes: "ps",
      };
      console.log("text: " + searchText);
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`, {
        headers: {
          "User-Agent": "ServLink/1.0 (shamstree@gmail.com)",
        },
      });
      const result = await response.json();
      console.log(result);
      setListPlace(result);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectPosition(item);
        console.log(item);
      }}
    >
      <Ionicons
        name="location-sharp"
        size={35}
        color={"#7b3685ff"}
        style={styles.icon}
      />
      <Text style={styles.itemText}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#faedf9ff", borderRadius: 10 }}>
      <View style={styles.searchContainer}>
        <View style={{ padding: 2, paddingTop: 3 }}>
          <Link href="/categoryPage">
            <Ionicons name="arrow-back-outline" size={30} color={"#63036aff"} />
          </Link>
        </View>

        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search location..."
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              setListPlace([]);
            }}
            style={{ paddingTop: 6 }}
          >
            <Ionicons name="close-circle" size={22} color="#63036aff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            handleSearch();
          }}
        >
          <Text
            style={{
              backgroundColor: "#6a0568ff",
              color: "#ffffffff",
              fontSize: 18.5,
              padding: 5,
              fontWeight: "700",
              borderRadius: 10,
              marginTop: 2,
            }}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listPlace}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};
export default SearchBox;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 5,
    marginRight: 5,
    height: 40,
    fontSize: 17,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
});
