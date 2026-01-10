import { useState, useEffect, useContext } from "react";
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
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ServiceInfoModal from "../serviceInfoModal";
import EditServiceModal from "../editServiceModal";
import AddNewServiceModal from "../addNewServiceModal";
import { AppContext } from "../../../context/AppContext";

export default function ProviderServices() {
  const [services, setServices] = useState([
    {
      Provider_Services_id: "1",
      serviceName: "AC Installation & Repair",
      categoryName: "Electricity",
      description:
        "Installation and repair of all residential and commercial AC units.",
      base_price: 120,
      numOfPendingsOrders: 0,
      numOfCancelledOrders: 45,
      numOfCompletedOrders: 45,
      service_location: "Ramallah,Al-Bireh,Beitunia",
      image: "http://10.0.2.2:5000/assets/Tree_trimming.jpg",
    },
  ]);
  const [originalServices, setOriginalServices] = useState(services);
  const [selectedService, setSelectedService] = useState(null);
  const ip = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${ip}:5000`;
  const [showEditForm, setShowEditForm] = useState(false); //for edit form modal
  const [showAddForm, setShowAddForm] = useState(false); //for add form modal
  const [currentService, setCurrentService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { loggedUser } = useContext(AppContext);

  //to delete a service
  const deleteProviderService = async (Provider_Service_id) => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderServiceList/deleteProviderService/${Provider_Service_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.affectedRows > 0) {
        fetchProviderListServicesInfo();
        alert("Delete Done.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const addCategories = (fetchedData) => {
    let providerServicesCategories = [];
    providerServicesCategories.push("All");
    fetchedData.forEach((s) => {
      if (!providerServicesCategories.includes(s.categoryName))
        providerServicesCategories.push(s.categoryName);
    });
    setCategories(providerServicesCategories);
  };

  const fetchProviderListServicesInfo = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderServiceList/getProviderListServicesInfo/${loggedUser.user_id}`
      );
      const fetchedData = await response.json();
      setServices(fetchedData);
      setOriginalServices(fetchedData);
      addCategories(fetchedData);
      setSelectedCategory("All");
    } catch (error) {
      console.error(error.message);
    }
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
          onPress: () => {
            deleteProviderService(id);
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchProviderListServicesInfo();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setServices([...originalServices]);
    } else {
      const x = [...originalServices];
      setServices(x.filter((c) => c.categoryName === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={{ flex: 1 }}>
      <ServiceInfoModal
        visible={!!selectedService}
        service={selectedService}
        onClose={() => {
          setSelectedService(null);
          fetchProviderListServicesInfo();
        }}
      />

      <EditServiceModal
        visible={showEditForm}
        service={currentService}
        onClose={() => {
          setShowEditForm(false);
          fetchProviderListServicesInfo();
        }}
      />

      <AddNewServiceModal
        visible={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          fetchProviderListServicesInfo();
        }}
      />

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
              onPress={() => {
                setShowAddForm(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>
          {/* for filters */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
              backgroundColor: "#e4c1eaff",
              borderRadius: 10,
              flexWrap: "wrap",
            }}
          >
            {categories.map((c, index) => {
              const isActive = selectedCategory === c;

              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedCategory(c)}
                  style={{
                    padding: 15,
                    backgroundColor: isActive ? "#631176ff" : "#e4c1eaff",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? "#ffffffff" : "#3d045bff",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {/* for list services */}
          {services.map((service) => (
            <View key={service.Provider_Services_id} style={styles.card}>
              {service.image ? (
                <Image source={{ uri: service.image }} style={styles.image} />
              ) : (
                <View
                  style={{
                    width: "80%",
                    height: 120,
                    borderRadius: 12,
                    marginLeft: 100,
                    marginTop: 20,
                  }}
                >
                  <FontAwesome name="photo" size={100} color="#5e0352ff" />
                </View>
              )}
              <Text style={styles.serviceTitle}>{service.serviceName}</Text>
              <Text style={styles.category}>{service.categoryName}</Text>
              {/* for orders stats */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 30,
                  paddingVertical: 5,
                }}
              >
                <View style={styles.row}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#04661bff"
                  />
                  <Text style={styles.metaText}>
                    {service.numOfCompletedOrders
                      ? service.numOfCompletedOrders + " "
                      : 0 + " "}
                    orders
                  </Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcons
                    name="hourglass-empty"
                    size={16}
                    color="#a86106ff"
                  />
                  <Text style={styles.metaText}>
                    {service.numOfPendingsOrders
                      ? service.numOfPendingsOrders + " "
                      : 0 + " "}
                    orders
                  </Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcons name="cancel" size={16} color="#b50303ff" />
                  <Text style={styles.metaText}>
                    {service.numOfCancelledOrders
                      ? service.numOfCancelledOrders + " "
                      : 0 + " "}
                    orders
                  </Text>
                </View>
              </View>
              {/* service locations */}
              <View style={styles.row}>
                <Ionicons name="location" size={16} color="#555" />
                <Text style={styles.metaText}>{service.service_location}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{service.base_price} ₪</Text>
                <Text style={styles.priceUnit}>/ hour</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setCurrentService(service);
                    setShowEditForm(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#f1d5faff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#f7e2feff",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => deleteService(service.Provider_Services_id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setSelectedService(service)}
                >
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <Ionicons name="eye" size={21} color="#fff" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "900",
                        color: "#f7e2feff",
                      }}
                    >
                      View
                    </Text>
                  </View>
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
  image: { width: "100%", height: 150, borderRadius: 12, marginBottom: 10 },
  serviceTitle: { fontSize: 19, fontWeight: "800", color: "#3f043bff" },
  category: {
    color: "#7b3685ff",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  metaText: { color: "#3f3a3aff", fontWeight: "700", fontSize: 15 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 8,
  },
  price: { fontSize: 18, fontWeight: "700", color: "#16a34a" },
  priceUnit: { color: "#390747ff", fontSize: 15 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#6b1e85ff",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  deleteBtn: { backgroundColor: "#dc2626" },
});
