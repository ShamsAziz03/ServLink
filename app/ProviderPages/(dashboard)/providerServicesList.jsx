import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

const categories = [
  "Electricity",
  "Plumbing",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Other",
];

const mockServices = [
  {
    id: "1",
    title: "AC Installation & Repair",
    category: "Electricity",
    description:
      "Installation and repair of all residential and commercial AC units.",
    price: 120,
    priceType: "hourly",
    rating: 4.8,
    completedOrders: 45,
    locations: ["Ramallah", "Al-Bireh", "Beitunia"],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
  },
  {
    id: "2",
    title: "Plumbing & Leak Repair",
    category: "Plumbing",
    description:
      "Fixing leaks, plumbing issues, faucet installation and maintenance.",
    price: 80,
    priceType: "hourly",
    rating: 4.6,
    completedOrders: 32,
    locations: ["Ramallah", "Al-Bireh"],
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
  },
];

export default function ProviderServices() {
  const [services, setServices] = useState(mockServices);
  const [editingService, setEditingService] = useState(null);
  const [isAddService, setIsAddService] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [locations, setLocations] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategory(categories[0]);
    setDescription("");
    setPrice("");
    setLocations("");
  };

  const openEdit = (service) => {
    setEditingService(service);
    setTitle(service.title);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price.toString());
    setLocations(service.locations.join(", "));
  };

  const saveEdit = () => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              title,
              category,
              description,
              price: parseFloat(price),
              locations: locations.split(",").map((l) => l.trim()),
            }
          : s
      )
    );
    setEditingService(null);
    resetForm();
  };

  const saveNewService = () => {
    const newService = {
      id: Date.now().toString(),
      title,
      category,
      description,
      price: parseFloat(price),
      priceType: "hourly",
      rating: 0,
      completedOrders: 0,
      locations: locations.split(",").map((l) => l.trim()),
      image: "https://via.placeholder.com/400",
    };
    setServices((prev) => [newService, ...prev]);
    setIsAddService(false);
    resetForm();
  };

  const deleteService = (id) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setServices((prev) => prev.filter((s) => s.id !== id)),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={{ flex: 1 }}>
      {/* Modal */}
      <Modal
        visible={!!editingService || isAddService}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingService ? "Edit Service" : "Add New Service"}
            </Text>

            <TextInput
              placeholder="Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.pickerWrapper}>
              <Picker selectedValue={category} onValueChange={setCategory}>
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              placeholder="Price"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Locations (comma separated)"
              style={styles.input}
              value={locations}
              onChangeText={setLocations}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={editingService ? saveEdit : saveNewService}
            >
              <Text style={styles.saveBtnText}>
                {editingService ? "Save Changes" : "Add Service"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setEditingService(null);
                setIsAddService(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          padding: 20,
          marginBottom: 50,
          marginTop: 40,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* for my services and add service */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text style={styles.title}>My Services</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setIsAddService(true)}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>
          {/* for list services */}
          {services.map((service) => (
            <View key={service.id} style={styles.card}>
              <Image source={{ uri: service.image }} style={styles.image} />

              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.category}>{service.category}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {service.description}
              </Text>

              <View style={styles.row}>
                <FontAwesome5 name="star" size={14} color="#f59e0b" />
                <Text style={styles.metaText}>{service.rating}</Text>

                <Ionicons
                  name="eye"
                  size={16}
                  color="#555"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.metaText}>
                  {service.completedOrders} orders
                </Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="location" size={16} color="#555" />
                <Text style={styles.metaText}>
                  {service.locations.join(", ")}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{service.price} ₪</Text>
                <Text style={styles.priceUnit}>/ hour</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEdit(service)}
                >
                  <Ionicons name="create-outline" size={20} color="#f1d5faff" />
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "900",
                      color: "#f7e2feff",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => deleteService(service.id)}
                >
                  <Ionicons name="trash" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "900", color: "#601d77ff" },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#601d77ff",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 6,
  },
  saveBtn: {
    backgroundColor: "#601d77ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700" },
  cancelBtn: {
    backgroundColor: "#f1e4f5",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    alignItems: "center",
  },
  cancelBtnText: { color: "#601d77ff", fontWeight: "700" },
  card: {
    backgroundColor: "#fdf1ffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
  },
  image: { width: "100%", height: 160, borderRadius: 12, marginBottom: 10 },
  serviceTitle: { fontSize: 18, fontWeight: "800", color: "#3f043bff" },
  category: { color: "#7b3685ff", fontWeight: "700", marginBottom: 4 },
  description: { color: "#555", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  metaText: { color: "#555", fontWeight: "600" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 8,
  },
  price: { fontSize: 20, fontWeight: "900", color: "#16a34a" },
  priceUnit: { color: "#390747ff", fontSize: 15 },
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
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  deleteBtn: { backgroundColor: "#dc2626" },
});
