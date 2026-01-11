import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppContext } from "../../context/AppContext";
import AddOfferModal from "./addOfferModal";
import EditOfferModal from "./editOfferModal";

export default function ProviderOffers() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${API_BASE_URL}:5000`;
  const router = useRouter();
  const { loggedUser } = useContext(AppContext);

  const [offers, setOffers] = useState([
    {
      id: "1",
      title: "Home Cleaning Discount",
      description: "20% off full home cleaning services",
      old_price: 60,
      new_price: 48,
      percent: 20,
      status: "active",
      start_date: "Jan 1",
      end_date: "Jan 31",
    },
  ]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, seteditModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});

  //to delete a offer
  const deleteOfferFromDB = async (id) => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/providerOffers/deleteOffer/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.affectedRows > 0) {
        fetchOffers();
        alert("Delete Done.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteOffer = (id) => {
    Alert.alert("Delete Offer", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteOfferFromDB(id);
        },
      },
    ]);
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/providerOffers/getProviderOffers/${loggedUser.user_id}`
      );
      const fetchedData = await response.json();
      setOffers(fetchedData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={{ flex: 1 }}>
      <AddOfferModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          fetchOffers();
        }}
      />

      <EditOfferModal
        visible={editModalVisible}
        onClose={() => {
          seteditModalVisible(false);
          fetchOffers();
        }}
        offer={selectedOffer}
      />

      <ScrollView style={{ padding: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={25} color="#601d77ff" />
            </Pressable>
            <Text style={styles.title}>My Offers</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addText}>Add Offer</Text>
          </TouchableOpacity>
        </View>

        {/* Offers */}
        {offers.map((offer) => (
          <View key={offer.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.percent}>{offer.percent}%</Text>
            </View>

            <Text style={styles.name}>{offer.name}</Text>
            <Text style={styles.desc}>{offer.description}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>₪{offer.old_price}/hr</Text>
              <Text style={styles.newPrice}>₪{offer.new_price}/hr</Text>
            </View>

            <Text style={styles.date}>
              {offer.start_date.split("T")[0]} {" To "}{" "}
              {offer.end_date.split("T")[0]}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setSelectedOffer(offer);
                  seteditModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.delete]}
                onPress={() => deleteOffer(offer.id)}
              >
                <MaterialIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {offers.length === 0 && (
          <Text style={styles.empty}>No offers found</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    alignItems: "center",
    marginTop: 50,
    borderBottomWidth: 0.2,
    borderBottomColor: "#aba5a5",
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#601d77ff" },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#601d77ff",
    padding: 5,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
  },
  addText: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: "#fdf1ffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offerTitle: { fontSize: 18, fontWeight: "800", color: "#3f043bff" },
  percent: { fontSize: 18, fontWeight: "900", color: "#dc2626" },
  desc: { color: "#555", marginVertical: 6 },
  name: { color: "#600756", marginVertical: 6, fontSize: 15 },
  priceRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    fontWeight: "700",
  },
  newPrice: { color: "#16a34a", fontSize: 18, fontWeight: "900" },

  date: { marginTop: 6, color: "#555", fontWeight: "600" },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#6b1e85ff",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  delete: { backgroundColor: "#dc2626" },
  actionText: { color: "#fff", fontWeight: "800" },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#7e4189ff",
    fontSize: 18,
    fontWeight: "700",
  },
});
