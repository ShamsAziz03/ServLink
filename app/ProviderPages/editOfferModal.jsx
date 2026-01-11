import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const ip = process.env.EXPO_PUBLIC_IP;
const API_ADDRESS = `http://${ip}:5000`;

const EditOfferModal = ({ visible, onClose, offer }) => {
  const { width, height } = Dimensions.get("window");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    percent: "",
    startDate: "",
    endDate: "",
  });

  const [showStartDateCalender, setShowStartDateCalender] = useState(false);
  const [showEndDateCalender, setShowEndDateCalender] = useState(false);

  useEffect(() => {
    if (!offer || !visible) return;

    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      basePrice: offer.base_price.toString() || "",
      percent: offer.percent?.toString() || "",
      startDate: offer.start_date.split("T")[0] || "",
      endDate: offer.end_date.split("T")[0] || "",
    });
  }, [visible, offer?.id]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateOfferInfo = async () => {
    const obj = {
      id: offer.id,
      ...formData,
    };

    try {
      const res = await fetch(`${API_ADDRESS}/providerOffers/updateOffer`, {
        method: "PUT",
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

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Offer</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>Offer Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(t) => handleChange("title", t)}
            />
            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={formData.description}
              onChangeText={(t) => handleChange("description", t)}
            />
            {/* Prices */}
            <View style={{ flexDirection: "row", gap: 30 }}>
              <Text style={styles.label}>Old Price</Text>
              <Text style={styles.label}>{formData.basePrice} ₪/hr</Text>
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
                  Number(formData.basePrice) -
                  Number(formData.percent / 100) * Number(formData.basePrice)
                ).toString()} ₪/hr
              </Text>
            </View>

            {/* Dates */}
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
            {/* End Date */}
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
            <Pressable style={styles.saveBtn} onPress={updateOfferInfo}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </ScrollView>

          {/* modal for start date calender */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showStartDateCalender}
            onRequestClose={() => setShowStartDateCalender(false)}
          >
            <View style={styles.overlayScreen}>
              <View
                style={[
                  styles.calenderView,
                  { width: width / 1.2, height: height - 400, marginTop: 200 },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.title}>Calender</Text>
                  <Pressable
                    onPress={() => setShowStartDateCalender(false)}
                    style={styles.cancle}
                  >
                    <MaterialIcons name="clear" size={30} color="#601d77ff" />
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

          {/* modal for end date calender */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showEndDateCalender}
            onRequestClose={() => setShowEndDateCalender(false)}
          >
            <View style={styles.overlayScreen}>
              <View
                style={[
                  styles.calenderView,
                  { width: width / 1.2, height: height - 400, marginTop: 200 },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.title}>Calender</Text>
                  <Pressable
                    onPress={() => setShowEndDateCalender(false)}
                    style={styles.cancle}
                  >
                    <MaterialIcons name="clear" size={30} color="#601d77ff" />
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

export default EditOfferModal;

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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8b1e99ff",
  },
  label: {
    fontSize: 18,
    color: "#741f6bff",
    fontWeight: "500",
    textShadowColor: "rgba(106, 8, 117, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelBtn: {
    backgroundColor: "#e2cde9ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#601d77ff",
    fontWeight: "700",
  },
  overlayScreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  calenderView: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  cancle: { paddingLeft: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    paddingLeft: 50,
  },
});
