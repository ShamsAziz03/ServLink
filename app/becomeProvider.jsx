import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default function BecomeProviderScreen() {
  const [isProvider, setIsProvider] = useState(false);
  const [images, setImages] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [about, setAbout] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selected]);
    }
  };

  const handleSubmit = () => {
    alert("Provider information submitted!");
  };

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#94469dff"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Become a Service Provider</Text>

          <View style={styles.providerRow}>
            <Checkbox
              status={isProvider ? "checked" : "unchecked"}
              onPress={() => setIsProvider(!isProvider)}
              color="#750d83ff"
            />
            <Text style={styles.providerText}>I’m a Service Provider</Text>
          </View>

          {isProvider && (
            <>
              <TextInput
                label="Service Type"
                mode="outlined"
                style={styles.input}
                value={serviceType}
                onChangeText={setServiceType}
              />
              <TextInput
                label="Hourly Rate ($)"
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
              />
              <TextInput
                label="About You"
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                value={about}
                onChangeText={setAbout}
              />
              <TextInput
                label="Working Hours"
                mode="outlined"
                placeholder="e.g. 9:00 AM - 6:00 PM"
                style={styles.input}
                value={workingHours}
                onChangeText={setWorkingHours}
              />

              <Text style={styles.subtitle}>Upload Sample Work</Text>
              <Button
                mode="contained"
                onPress={pickImage}
                style={styles.uploadButton}
                labelStyle={{ fontWeight: "bold" }}
              >
                Choose Images
              </Button>

              <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.imagePreview}
                  />
                ))}
              </View>
            </>
          )}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#37043a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6a5c7b",
  },
  subtitle: {
    marginTop: 15,
    fontWeight: "600",
    fontSize: 16,
    color: "#6a5c7b",
  },
  input: { marginVertical: 8, backgroundColor: "#f1ebf6ff" },
  button: {
    marginTop: 20,
    backgroundColor: "#750d83ff",
    borderRadius: 15,
    paddingVertical: 5,
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: "#78688fff",
    borderRadius: 10,
  },
  providerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  providerText: { color: "#750d83ff", fontWeight: "500" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  imagePreview: { width: 90, height: 90, borderRadius: 10, margin: 5 },
});
