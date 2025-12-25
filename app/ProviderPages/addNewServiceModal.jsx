import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ImageModal from "../../components/imageModal";

const API_ADDRESS = "http://10.0.2.2:5000";

const AddNewServiceModal = ({ visible, onClose }) => {
  const [categories, setCategories] = useState([
    "Electricity",
    "Plumbing",
    "Carpentry",
    "Cleaning",
    "Painting",
  ]);
  const [providerExpImages, setProviderExpImages] = useState([
    "http://10.0.2.2:5000/assets/agriculture.png",
    "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
  ]);
  const [showImage, setShowImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [fullFormData, setFullFormData] = useState({
    serviceName: "",
    categoryName: "",
    description: "",
    base_price: "",
    service_location: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderServiceList/getAllCategories`
      );
      const fetchedData = await response.json();
      const data = fetchedData.map((d) => d.name);
      setCategories(data);
    } catch (error) {
      console.error(error.massege);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (key, value) => {
    setFullFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveEdit = () => {
    console.log("Saved data:", fullFormData);
    onClose();
  };
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Service</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

          <ImageModal
            visible={showImage}
            img={currentImage}
            onClose={() => setShowImage(false)}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 16,
                color: "#741f6bff",
                fontWeight: "500",
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Service Name
            </Text>
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={fullFormData.serviceName}
              onChangeText={(text) => handleChange("serviceName", text)}
            />

            <Text
              style={{
                fontSize: 16,
                color: "#741f6bff",
                fontWeight: "500",
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Service Category
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={fullFormData.categoryName}
                onValueChange={(itemValue) =>
                  handleChange("categoryName", itemValue)
                }
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "#741f6bff",
                fontWeight: "500",
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Service Description
            </Text>
            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 80 }]}
              value={fullFormData.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
            />

            <Text
              style={{
                fontSize: 16,
                color: "#741f6bff",
                fontWeight: "500",
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Service Price
            </Text>
            <TextInput
              placeholder="Price"
              style={styles.input}
              value={fullFormData.base_price}
              onChangeText={(text) => handleChange("base_price", text)}
              keyboardType="numeric"
            />

            <Text
              style={{
                fontSize: 16,
                color: "#741f6bff",
                fontWeight: "500",
                textShadowColor: "rgba(106, 8, 117, 0.3)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Service Location
            </Text>
            <TextInput
              placeholder="Locations (comma separated)"
              style={styles.input}
              value={fullFormData.service_location}
              onChangeText={(text) => handleChange("service_location", text)}
            />

            {/* for images */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <FontAwesome name="image" size={18} color="#65186fff" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#741f6bff",
                  fontWeight: "500",
                  textShadowColor: "rgba(106, 8, 117, 0.3)",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                Experience Images
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginBlockEnd: 15 }}
            >
              {providerExpImages.map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setCurrentImage(img);
                    setShowImage(true);
                  }}
                >
                  <Image source={{ uri: img }} style={styles.image} />
                </Pressable>
              ))}
            </ScrollView>

            <Pressable style={styles.saveBtn} onPress={saveEdit}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setFullFormData({ ...service });
                onClose();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddNewServiceModal;

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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 20,
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
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b289b1ff",
  },
});
