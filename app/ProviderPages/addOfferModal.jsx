import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { AppContext } from "../../context/AppContext";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

const ip = process.env.EXPO_PUBLIC_IP;
const API_ADDRESS = `http://${ip}:5000`;

const AddOfferModal = ({ visible, onClose }) => {
  const { loggedUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    percent: "",
    startDate: "",
    endDate: "",
    providerServiceId: "",
    providerName: "",
  });

  const [showStartDateCalender, setShowStartDateCalender] = useState(false);
  const [showEndDateCalender, setShowEndDateCalender] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState({});

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `${API_ADDRESS}/providerOffers/getServices/${loggedUser.user_id}`
      );
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!visible) return;

    setFormData({
      title: "",
      description: "",
      basePrice: "",
      percent: "",
      startDate: "",
      endDate: "",
      providerServiceId: "",
      providerName: "",
    });
    fetchServices();
  }, [visible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addOffer = async (obj) => {
    try {
      const res = await fetch(`${API_ADDRESS}/providerOffers/addOffer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.success);
        onClose();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const saveAdd = () => {
    const obj = {
      ...formData,
      basePrice: Number(formData.basePrice),
      percent: Number(formData.percent),
      providerServiceId: Number(formData.providerServiceId),
    };

    addOffer(obj);
  };
  useEffect(() => {
    if (!selectedService) return;

    setFormData((prev) => ({
      ...prev,
      basePrice: selectedService.base_price?.toString() || "",
      providerServiceId: selectedService.Provider_Services_id?.toString() || "",
      providerName:
        selectedService.first_name?.toString() ||
        "" + +" " + selectedService.last_name?.toString() ||
        "",
    }));
  }, [selectedService]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Offer</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Offer Title */}
            <Text style={styles.label}>Offer Title</Text>
            <TextInput
              placeholder="Offer title"
              style={styles.input}
              value={formData.title}
              onChangeText={(t) => handleChange("title", t)}
            />

            {/* Description */}
            <Text style={styles.label}>Offer Description</Text>
            <TextInput
              placeholder="Write offer description..."
              style={[styles.input, { height: 80 }]}
              multiline
              value={formData.description}
              onChangeText={(t) => handleChange("description", t)}
            />
            {/* select service */}

            <Text style={styles.label}>Select Service</Text>

            <Picker
              selectedValue={selectedService}
              onValueChange={(value) => setSelectedService(value)}
            >
              {services.length > 0 &&
                services.map((s, i) => (
                  <Picker.Item key={i} label={s.serviceName} value={s} />
                ))}
            </Picker>

            {/* Prices */}
            <View style={{ flexDirection: "row", gap: 30 }}>
              <Text style={styles.label}>Old Price</Text>
              <Text style={styles.label}>{formData.basePrice}</Text>
            </View>

            <Text style={styles.label}>Discount (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.percent}
              onChangeText={(t) => handleChange("percent", t)}
            />

            <View style={{ flexDirection: "row", gap: 30 }}>
              <Text style={styles.label}>New Price</Text>
              <Text style={styles.label}>
                {(
                  Number(formData.percent / 100) * Number(formData.basePrice)
                ).toString()}
              </Text>
            </View>

            {/* Dates with icons */}
            <Pressable
              onPress={() => setShowStartDateCalender(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#741f6bff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 16, color: "#741f6bff", fontWeight: "500" }}
              >
                {formData.startDate || "Start Date"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEndDateCalender(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#741f6bff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 16, color: "#741f6bff", fontWeight: "500" }}
              >
                {formData.endDate || "End Date"}
              </Text>
            </Pressable>

            {/* Actions */}
            <Pressable style={styles.saveBtn} onPress={() => saveAdd()}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </ScrollView>

          {/* Start Date Calendar Modal */}
          <Modal
            transparent
            visible={showStartDateCalender}
            animationType="fade"
            onRequestClose={() => setShowStartDateCalender(false)}
          >
            <View style={styles.overlayScreen}>
              <View style={[styles.calenderView, { marginTop: 200 }]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.calenderTitle}>Select Start Date</Text>
                  <Pressable onPress={() => setShowStartDateCalender(false)}>
                    <MaterialIcons name="clear" size={28} color="#601d77ff" />
                  </Pressable>
                </View>
                <Calendar
                  minDate={new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => {
                    handleChange("startDate", day.dateString.split("T")[0]);
                    setShowStartDateCalender(false);
                  }}
                />
              </View>
            </View>
          </Modal>

          {/* End Date Calendar Modal */}
          <Modal
            transparent
            visible={showEndDateCalender}
            animationType="fade"
            onRequestClose={() => setShowEndDateCalender(false)}
          >
            <View style={styles.overlayScreen}>
              <View style={[styles.calenderView, { marginTop: 200 }]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.calenderTitle}>Select End Date</Text>
                  <Pressable onPress={() => setShowEndDateCalender(false)}>
                    <MaterialIcons name="clear" size={28} color="#601d77ff" />
                  </Pressable>
                </View>
                <Calendar
                  minDate={new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => {
                    handleChange("endDate", day.dateString.split("T")[0]);
                    setShowEndDateCalender(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

export default AddOfferModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fbf0fbff",
    width: "90%",
    height: "85%",
    borderRadius: 15,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 0.7,
    borderBottomColor: "#cfcfcfff",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#8b1e99ff" },
  label: {
    fontSize: 16,
    color: "#741f6bff",
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 20,
    color: "#490245ff",
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: "#e2cde9ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    alignItems: "center",
  },
  cancelBtnText: { color: "#601d77ff", fontWeight: "700" },
  overlayScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  calenderView: {
    width: width / 1.1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
  },
  calenderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#741f6bff",
    marginBottom: 10,
  },
});
