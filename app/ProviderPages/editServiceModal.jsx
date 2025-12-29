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
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ImageModal from "../../components/imageModal";
import { Checkbox } from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import ChooseImageModal from "./chooseImageModal";

const API_ADDRESS = "http://10.0.2.2:5000";

const EditServiceModel = ({ visible, onClose, service }) => {
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
  });

  const BASE_WESTBANK_CITIES = [
    "Ramallah",
    "Nablus",
    "Hebron",
    "Jenin",
    "Tulkarm",
    "Qalqilya",
    "Bethlehem",
    "Jericho",
    "Salfit",
    "Tubas",
    "Other",
  ];
  const [WESTBANK_CITIES, setWestBankCities] = useState(BASE_WESTBANK_CITIES);
  const [selectedCities, setSelectedCities] = useState([]);

  const [showOther, setShowOther] = useState(false);
  const [addNewCity, setAddNewCity] = useState("");
  const [showChooseMode, setShowChooseMode] = useState(false); //to let user choose camera or gallary

  //to fetch categories
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

  //on load each modal
  useEffect(() => {
    if (!service || !visible) return;
    setShowOther(false);
    setAddNewCity("");
    setWestBankCities(BASE_WESTBANK_CITIES);
    setSelectedCities([]);
    const imagesArray = service.images.split(",");
    setProviderExpImages(imagesArray);
    fetchCategories();
    setFullFormData({
      serviceName: service.serviceName || "",
      categoryName: service.categoryName || "",
      description: service.description || "",
      base_price: service.base_price?.toString() || "",
    });
    const cities = service.service_location.split(",").map((c) => c.trim());
    setSelectedCities(cities);
    const mergedCities = [
      ...BASE_WESTBANK_CITIES,
      ...cities.filter((c) => !BASE_WESTBANK_CITIES.includes(c)),
    ];
    setWestBankCities(mergedCities);
  }, [visible, service?.Provider_Services_id]);

  //to toggle city on select from check box
  const toggleCity = (city) => {
    if (city === "Other") {
      setShowOther(true);
    } else {
      setShowOther(false);
      if (selectedCities.includes(city)) {
        const newSelectedCities = selectedCities.filter((c) => c !== city);
        setSelectedCities(newSelectedCities);
      } else {
        setSelectedCities((prev) => [...prev, city]);
      }
    }
  };

  //to handle each change inside the form
  const handleChange = (key, value) => {
    setFullFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //to fetch put method in db with new info
  const updateServiceInfo = async (obj) => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderServiceList/updateServiceInfo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        alert(fetchedData.success);
        onClose();
      } else {
        alert(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //to add new images to images
  const addToImages = (newImage) => {
    const newImages = [...providerExpImages];
    newImages.push(newImage);
    setProviderExpImages(newImages);
    // console.log(newImages.toString());
  };

  const removeImage = (img) => {
    let newImages;
    newImages = providerExpImages.filter((i) => i !== img);
    setProviderExpImages(newImages);
    // console.log("new images: ",newImages.toString());
  };

  //to save edits
  const saveEdit = () => {
    let finalCities = [...selectedCities];
    if (addNewCity && !finalCities.includes(addNewCity)) {
      finalCities.push(addNewCity);
    }
    const obj = {
      Provider_Services_id: service.Provider_Services_id,
      serviceName: fullFormData.serviceName,
      categoryName: fullFormData.categoryName,
      description: fullFormData.description,
      base_price: fullFormData.base_price.toString(),
      service_location: finalCities.toString(),
      images: providerExpImages.toString(),
    };
    console.log("obj ", obj);
    updateServiceInfo(obj);
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

          <ChooseImageModal
            visible={showChooseMode}
            onClose={() => setShowChooseMode(false)}
            addToImages={addToImages}
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
            {/* for choose city */}

            <View
              style={{
                flexDirection: "row",
                gap: 20,
                flexWrap: "wrap",
                marginVertical: 25,
              }}
            >
              {WESTBANK_CITIES.map((city) => (
                <View key={city} style={{ flexDirection: "row", gap: 5 }}>
                  <Checkbox
                    value={selectedCities.includes(city)}
                    onValueChange={() => toggleCity(city)}
                    color={
                      selectedCities.includes(city) ? "#750d8fff" : undefined
                    }
                  />
                  <Text
                    style={{
                      color: "#40024cff",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {city}
                  </Text>
                </View>
              ))}
            </View>
            {showOther && (
              <TextInput
                placeholder="Other (Gaza, Hebron, ...etc)"
                style={styles.input}
                onChangeText={(text) => {
                  setAddNewCity(text);
                }}
              />
            )}

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
                  style={{ position: "relative" }}
                >
                  <Pressable
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 12,
                      backgroundColor: "#fff",
                      borderRadius: 50,
                      zIndex: 1,
                    }}
                    onPress={() => removeImage(img)}
                  >
                    <MaterialIcons name="cancel" size={25} color="#8d2007ff" />
                  </Pressable>
                  <Image source={{ uri: img }} style={styles.image} />
                </Pressable>
              ))}
              <TouchableOpacity
                style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  backgroundColor: "#ecc4e6ff",
                  borderRadius: 10,
                }}
                onPress={() => setShowChooseMode(true)}
              >
                <Ionicons name="add-circle-sharp" size={40} color="#430549ff" />
              </TouchableOpacity>
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

export default EditServiceModel;

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
    width: 90,
    height: 90,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b289b1ff",
  },
});
