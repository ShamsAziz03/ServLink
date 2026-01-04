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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_ADDRESS = "http://${API_BASE_URL}";

const AddCategoryModal = ({ visible, onClose, fetchCategories }) => {
  const [image, setImage] = useState(
    "http://${API_BASE_URL}/assets/handyman.png"
  );
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const pickImage = async (mode) => {
    if (mode === "Image") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access the media library is required."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const addCategory = async () => {
    try {
      if (categoryDesc === "" || categoryName === "") {
        alert("Fill all data!");
        return;
      }
      const obj = {
        name: categoryName,
        description: categoryDesc,
        cover_image: image,
      };
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderServiceList/addCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.success) {
        alert(fetchedData.success);
        fetchCategories();
        onClose();
      } else {
        alert(fetchedData.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Category</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

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
              Category Name
            </Text>
            <TextInput
              placeholder="Title"
              style={styles.input}
              onChangeText={(text) => setCategoryName(text)}
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
              Category Description
            </Text>
            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 80 }]}
              onChangeText={(text) => setCategoryDesc(text)}
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
              Choose Cover Image
            </Text>
            <TouchableOpacity
              style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor: "#f3dbefff",
                borderRadius: 10,
                width: 80,
              }}
              onPress={() => pickImage("Image")}
            >
              <Ionicons name="add-circle-sharp" size={40} color="#430549ff" />
            </TouchableOpacity>

            <Pressable style={styles.saveBtn} onPress={() => addCategory()}>
              <Text style={styles.saveBtnText}>Add Category</Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
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

export default AddCategoryModal;

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
    height: "70%",
    borderRadius: 15,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 0.7,
    borderBottomColor: "#cfcfcfff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8b1e99ff",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  option: {
    alignItems: "center",
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#430549ff",
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
