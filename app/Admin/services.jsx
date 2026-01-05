import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import axios from "axios";

const Colors = {
  primary: "#6c3483",
  secondary: "#A78BFA",
  background: "#fff",
  card: "#6c3483",
  textSecondary: "#D1D5DB",
  softPurple: "#F3E8FF",
};

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get("http://192.168.1.12:5000/api/services");
    setServices(res.data);
  };
const filtered = services.filter(
  (s) =>
    s.service_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase()) ||
    s.category_name?.toLowerCase().includes(search.toLowerCase())
);


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.service_name}</Text>
        <Text style={styles.category}> Category: {item.category_name}</Text>
        <Text style={styles.desc} numberOfLines={6}> Description: {item.description}
        </Text>
         <Text style={styles.price}> Price start from: {item.base_price} ₪
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Services</Text>

      <TextInput
        placeholder="Search service..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.service_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    color: Colors.softPurple,
    fontSize: 13,
    marginVertical: 2,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  price:{
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "bold",

  },
});
