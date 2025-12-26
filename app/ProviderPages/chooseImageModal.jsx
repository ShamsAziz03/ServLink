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
import * as ImagePicker from "expo-image-picker";

const ChooseImageModal = ({ visible, onClose, addToImages }) => {
  const [image, setImage] = useState(null);

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
    //   console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else if (mode === "Camera") {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access the media library is required."
        );
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    //   console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  useEffect(() => {
    if (!image) return;
    addToImages(image);
    onClose();
  }, [image]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Image</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="clear" size={28} color="#601d77ff" />
            </Pressable>
          </View>

          <View style={styles.options}>
            <Pressable
              style={styles.option}
              onPress={() => pickImage("Camera")}
            >
              <MaterialIcons name="photo-camera" size={32} color="#430549ff" />
              <Text style={styles.optionText}>Camera</Text>
            </Pressable>

            <Pressable style={styles.option} onPress={() => pickImage("Image")}>
              <MaterialIcons name="photo-library" size={32} color="#430549ff" />
              <Text style={styles.optionText}>Gallery</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseImageModal;

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
    height: "25%",
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
});
