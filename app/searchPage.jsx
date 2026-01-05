import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Menu, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import ProviderProfile from "../app/providerProfile";

const SearchItem = ({ item }) => {
  const navigation = useNavigation();
  const { setSelected_from_searchPage } = useContext(AppContext);
  const [showProviderProfile, setShowProviderProfile] = useState(false);
  const [serviceProviderInfo, setServiceProviderInfo] = useState({});

  const locationArray = item.service_locations?.split(",") || [];

  const goToServicePage = async (serviceId) => {
    try {
      const res = await fetch(
        `http://192.168.1.12:5000/categoryPage/serviceFromSearch/${serviceId}`
      );
      const serviceInfo = await res.json();

      if (!serviceInfo) return;
      console.log(JSON.stringify(serviceInfo));

      navigation.navigate("servicePage", {
        serviceInfo: {
          service_id: serviceInfo.service_id,
          category_id: serviceInfo.category_id,
          title: serviceInfo.service_name,
          image: serviceInfo.image,
          description: serviceInfo.service_description,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardPress = () => {
    const selected = {
      service_id: item.service_id,
      title: item.service_name,
      description: item.service_description,
      hourly_rate: item.hourly_rate,
      locations: item.service_locations,
      category: item.category_name,
      provider: {
        id: item.provider_id,
        name: `${item.first_name} ${item.last_name}`,
      },
    };

    setSelected_from_searchPage(selected);

    console.log("SELECTED FROM SEARCH:", selected);
    goToServicePage(selected.service_id);
  };

  const goToProviderPage = async (providerId) => {
    try {
      const res = await fetch(
        `http://192.168.1.12:5000/bookingService/providerFromSearch/${providerId}`
      );
      const providerInfo = await res.json();
      if (!providerInfo) return;
      setServiceProviderInfo(providerInfo);
      console.log("test     " + JSON.stringify(providerInfo));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProviderPress = () => {
    console.log("PROVIDER CLICKED:", {
      providerId: item.provider_id,
      name: `${item.first_name} ${item.last_name}`,
    });
    goToProviderPage(item.provider_id);
    setShowProviderProfile(true);
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleCardPress}>
      <LinearGradient
        colors={["#ffffffff", "#feecffff"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.card}
      >
        {/* Title */}
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.service_name}</Text>
          <MaterialCommunityIcons
            name="toolbox-outline"
            size={22}
            color="#4b007d"
          />
        </View>

        {/* Category */}
        <View style={styles.cardRow}>
          <MaterialCommunityIcons
            name="label-variant-outline"
            size={18}
            color="#7a0ea0"
          />
          <Text style={styles.category}>{item.category_name}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{item.service_description}</Text>

        {/* Price */}
        <View style={styles.cardRow}>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={19}
            color="#0f7f33"
          />
          <Text style={styles.price}>
            Hourly Rate:{" "}
            <Text style={{ fontWeight: "bold" }}>{item.hourly_rate}₪</Text>
          </Text>
        </View>

        {/* Locations */}
        <View style={[styles.cardRow, { flexWrap: "wrap", marginTop: 5 }]}>
          <Ionicons name="location-outline" size={18} color="#b00020" />
          <Text style={styles.locationTitle}>Locations:</Text>
          <View style={styles.badgeContainer}>
            {locationArray.map((loc, idx) => (
              <View
                key={`${item.service_id}-${loc}-${idx}`}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>{loc.trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Provider */}
        <View style={[styles.cardRow, { marginTop: 8 }]}>
          <Ionicons name="person-circle-outline" size={18} color="#333" />
          <TouchableOpacity onPress={handleProviderPress}>
            <Text style={styles.providerLink}>
              {item.first_name} {item.last_name}
            </Text>
          </TouchableOpacity>
        </View>
        <ProviderProfile
          visible={showProviderProfile}
          onClose={() => setShowProviderProfile(false)}
          providerInfo={serviceProviderInfo}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const { pageToBack } = useLocalSearchParams();

  const fetchResults = async () => {
    setLoading(true);
    try {
      const url = `http://192.168.1.12:5000/api/services/search?q=${encodeURIComponent(
        query
      )}&sort=${sort}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [query, sort]);

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
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: "#f7eaf9ff",
          marginBottom: 5,
        }}
      >
        <Link href={pageToBack}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={"#63036aff"}
            style={{ padding: 10 }}
          />
        </Link>
        <View style={styles.searchBar}>
          <Ionicons name="search-sharp" size={24} color="#63036aff" />
          <TextInput
            placeholder="Search by service, category, or provider"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={22} color="#63036aff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by price:</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              textColor="#63036aff"
              style={{ borderColor: "#63036aff" }}
            >
              {sort === ""
                ? "None"
                : sort === "asc"
                ? "Low → High"
                : "High → Low"}
            </Button>
          }
        >
          <Menu.Item
            title="None"
            onPress={() => {
              setSort("");
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title="Low → High"
            onPress={() => {
              setSort("asc");
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title="High → Low"
            onPress={() => {
              setSort("desc");
              setMenuVisible(false);
            }}
          />
        </Menu>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#63036aff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) =>
            `service-${item.service_id}-${item.provider_id}-${index}`
          }
          contentContainerStyle={{ padding: 20, gap: 15 }}
          renderItem={({ item }) => <SearchItem item={item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No results found
            </Text>
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  fullView: { flex: 1, backgroundColor: "#f7eaf9ff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    margin: 20,
    borderColor: "#3a0350ff",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginRight: 30,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 8, height: 40 },
  card: { padding: 15, borderRadius: 15, backgroundColor: "#ffffffff" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { fontSize: 16, fontWeight: "bold", color: "#3a0350ff" },
  category: { fontSize: 14, fontWeight: "600", color: "#63036aff" },
  description: { fontSize: 14, color: "#333" },
  price: { fontSize: 15, fontWeight: "700", color: "#0f7f33" },
  locationTitle: { fontSize: 14, fontWeight: "600", color: "#b00020" },
  badgeContainer: { flexDirection: "row", flexWrap: "wrap", marginLeft: 25 },
  badge: {
    backgroundColor: "#ffffffaa",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d7b8ff",
  },
  badgeText: { fontSize: 12, color: "#4b007d", fontWeight: "600" },
  providerLink: {
    fontSize: 13,
    color: "#63036aff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    gap: 20,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#63036aff",
    marginTop: 7,
  },
});
