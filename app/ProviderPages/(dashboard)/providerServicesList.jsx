import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* ===== MOCK DATA FROM DB ===== */

const provider = {
  provider_id: 1,
  service_locations: ["Amman", "Zarqa", "Irbid"],
};

const servicesTable = [
  { service_id: 1, name: "Plumbing" },
  { service_id: 2, name: "Electrical Repair" },
  { service_id: 3, name: "AC Maintenance" },
];

const providerServicesInitial = [
  {
    Provider_Services_id: 1,
    service_id: 1,
    service_name: "Plumbing",
    base_price: 25,
    images: [
      "https://10.0.2.2:5000/assets/Babysitting.jpg",
      "https://10.0.2.2:5000/assets/Babysitting.jpg",
    ],
  },
];

/* ===== COMPONENT ===== */

export default function MyServices() {
  const [services, setServices] = useState(providerServicesInitial);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");

  const openAdd = () => {
    setEditingService(null);
    setServiceType("");
    setPrice("");
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingService(item);
    setServiceType(item.service_name);
    setPrice(item.base_price.toString());
    setModalVisible(true);
  };

  const saveService = () => {
    if (!serviceType || !price) {
      Alert.alert("Error", "All fields required");
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.Provider_Services_id === editingService.Provider_Services_id
            ? { ...s, service_name: serviceType, base_price: price }
            : s
        )
      );
    } else {
      setServices((prev) => [
        ...prev,
        {
          Provider_Services_id: Date.now(),
          service_id: Date.now(),
          service_name: serviceType,
          base_price: price,
          images: [],
        },
      ]);
    }

    setModalVisible(false);
  };

  const deleteService = (id) => {
    Alert.alert("Delete Service", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () =>
          setServices((prev) =>
            prev.filter((s) => s.Provider_Services_id !== id)
          ),
      },
    ]);
  };

  const renderCard = ({ item }) => (
    <LinearGradient colors={["#ffffff", "#f5f0fa"]} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.service_name}</Text>
        <Text style={styles.price}>${item.base_price}</Text>
      </View>

      <Text style={styles.sub}>Locations:</Text>
      <Text style={styles.text}>{provider.service_locations.join(", ")}</Text>

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {item.images.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <ActionButton
          icon="edit"
          text="Edit"
          color="#8e44ad"
          onPress={() => openEdit(item)}
        />
        <ActionButton
          icon="delete"
          text="Delete"
          color="#c0392b"
          onPress={() => deleteService(item.Provider_Services_id)}
        />
      </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <TouchableOpacity
        style={styles.statsBtn}
        onPress={() => router.push("/ProviderPages/favTaskerss")}
      >
        <MaterialIcons name="bar-chart" size={22} color="#fff" />
        <Text style={styles.statsText}>View Statistics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Add Service</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        keyExtractor={(item) => item.Provider_Services_id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* MODAL */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingService ? "Edit Service" : "Add Service"}
            </Text>

            <Text style={styles.label}>Service Type</Text>
            <TextInput
              style={styles.input}
              value={serviceType}
              onChangeText={setServiceType}
              placeholder="Plumbing"
            />

            <Text style={styles.label}>Base Price ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <Text style={styles.label}>Service Locations</Text>
            <Text style={styles.locations}>
              {provider.service_locations.join(", ")}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#750d83" }]}
                onPress={saveService}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#dc3545" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

/* ===== REUSABLE ===== */

const ActionButton = ({ icon, text, color, onPress }) => (
  <TouchableOpacity
    style={[styles.actionBtn, { backgroundColor: color }]}
    onPress={onPress}
  >
    <MaterialIcons name={icon} size={18} color="#fff" />
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
);

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#750d83",
    margin: 15,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  card: {
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#37043a" },
  price: { fontWeight: "bold", color: "#750d83" },
  sub: { marginTop: 10, fontWeight: "bold" },
  text: { color: "#4b4453" },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  actions: { flexDirection: "row", marginTop: 15 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  locations: { color: "#750d83", marginBottom: 10 },
  modalActions: { flexDirection: "row" },
  modalBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  statsBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#750d83",
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },
  statsText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
