import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import ResultsServiceMatcherFromAI from "../components/ResultsServiceMatcherFromAI";

const { width } = Dimensions.get("window");

const AIServiceMatcherScreen = () => {
  const ip = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${ip}:5000`;
  const router = useRouter();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [form, setForm] = useState({
    description: "",
    minBudget: "",
    maxBudget: "",
    city: "",
    preferredStartRangeDate: "",
    preferredEndRangeDate: "",
  }); //user request
  const [systemData, setSystemData] = useState({
    providerWorkingHours: [],
    providerServices: [],
    services: [],
    providerNotes: [],
    categories: [],
    provider: [],
    users: [],
  });
  const [aiResponse, setAIResponse] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const fetchData = async () => {
    try {
      //fetch schedule
      const fetchProviderWorkingHours = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getproviderWorkingHours`
      );
      const providerWorkingHours = await fetchProviderWorkingHours.json();
      setSystemData((prev) => ({
        ...prev,
        providerWorkingHours: providerWorkingHours,
      }));

      //   fetch SP
      const fetchProviderServices = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getProviderServices`
      );
      const providerServices = await fetchProviderServices.json();
      setSystemData((prev) => ({
        ...prev,
        providerServices: providerServices,
      }));

      //   fetch services
      const fetchServices = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getServices`
      );
      const services = await fetchServices.json();
      setSystemData((prev) => ({
        ...prev,
        services: services,
      }));

      //   getProviderNotes
      const fetchProviderNotes = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getProviderNotes`
      );
      const providerNotes = await fetchProviderNotes.json();
      setSystemData((prev) => ({
        ...prev,
        providerNotes: providerNotes,
      }));

      //   getCategories
      const fetchCategories = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getCategories`
      );
      const categories = await fetchCategories.json();
      setSystemData((prev) => ({
        ...prev,
        categories: categories,
      }));

      //   getProviders
      const fetchProviders = await fetch(
        `${API_ADDRESS}/serviceMatchAI/getProviders`
      );
      const provider = await fetchProviders.json();
      setSystemData((prev) => ({
        ...prev,
        provider: provider,
      }));

      //   getUsers
      const fetchUsers = await fetch(`${API_ADDRESS}/serviceMatchAI/getUsers`);
      const users = await fetchUsers.json();
      setSystemData((prev) => ({
        ...prev,
        users: users,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getServiceMatchAI = async () => {
    try {
      const obj = {
        userRequest: form,
        systemData: systemData,
      };
      const response = await fetch(
        `http://${ip}:5000/serviceMatchAI/getServiceMatchAI`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        }
      );
      const fetchedData = await response.json();
      console.log(
        "Data from AI for service match: " + JSON.stringify(fetchedData)
      );
      setAIResponse(fetchedData);
      setShowResultsModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    getServiceMatchAI();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 30 }}>
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={25} color="#741f6bff" />
            </Pressable>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="sparkles-outline" size={22} color="#741f6bff" />
              <Text style={styles.title}>Find Service Provider</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>
            Describe your issue or the service you need
          </Text>
          <TextInput
            placeholder="Describe your issue or the service you need, how fast you want the
            service, add more details ..."
            placeholderTextColor="#8d6a8cff"
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(t) => handleChange("description", t)}
            multiline
            textAlign="left"
          />

          <Text style={styles.label}>Budget (per hour)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>Minimum</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.minBudget}
                onChangeText={(m) => handleChange("minBudget", m)}
                placeholder="0"
                placeholderTextColor="#8d6a8cff"
              />
            </View>
            <View style={{ width: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>Maximum</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.maxBudget}
                onChangeText={(m) => handleChange("maxBudget", m)}
                placeholder="100"
                placeholderTextColor="#8d6a8cff"
              />
            </View>
          </View>

          <Text style={styles.label}>City</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.city}
              onValueChange={(v) => handleChange("city", v)}
            >
              <Picker.Item label="Ramallah" value="ramallah" />
              <Picker.Item label="Nablus" value="nablus" />
              <Picker.Item label="Hebron" value="hebron" />
              <Picker.Item label="Jenin" value="jenin" />
              <Picker.Item label="Tulkarm" value="tulkarm" />
              <Picker.Item label="Jericho" value="jericho" />
              <Picker.Item label="Bethlehem" value="bethlehem" />
              <Picker.Item label="Salfit" value="salfit" />
              <Picker.Item label="Qalqilya" value="qalqilya" />
            </Picker>
          </View>

          <Pressable
            onPress={() => setShowStartCalendar(true)}
            style={styles.dateRow}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#741f6bff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dateText}>
              Start: {form.preferredStartRangeDate || "Select start date"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowEndCalendar(true)}
            style={styles.dateRow}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#741f6bff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dateText}>
              End:{" "}
              {form.preferredEndRangeDate ||
                form.preferredStartRangeDate ||
                "Select end date"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.searchBtn}
            onPress={() => {
              handleSearch();
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="search-outline" size={20} color="#fff" />
              <Text style={styles.searchBtnText}>Search Now</Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* Start Date Modal */}
        <Modal
          transparent
          visible={showStartCalendar}
          animationType="fade"
          onRequestClose={() => setShowStartCalendar(false)}
        >
          <View style={styles.overlayScreen}>
            <View style={styles.calenderView}>
              <View style={styles.calHeader}>
                <Text style={styles.calenderTitle}>Select Start Date</Text>
                <Pressable onPress={() => setShowStartCalendar(false)}>
                  <MaterialIcons name="clear" size={28} color="#601d77ff" />
                </Pressable>
              </View>
              <Calendar
                minDate={new Date().toISOString().split("T")[0]}
                onDayPress={(day) => {
                  handleChange(
                    "preferredStartRangeDate",
                    day.dateString.split("T")[0]
                  );
                  setShowStartCalendar(false);
                }}
              />
            </View>
          </View>
        </Modal>

        {/* End Date Modal */}
        <Modal
          transparent
          visible={showEndCalendar}
          animationType="fade"
          onRequestClose={() => setShowEndCalendar(false)}
        >
          <View style={styles.overlayScreen}>
            <View style={styles.calenderView}>
              <View style={styles.calHeader}>
                <Text style={styles.calenderTitle}>Select End Date</Text>
                <Pressable onPress={() => setShowEndCalendar(false)}>
                  <MaterialIcons name="clear" size={28} color="#601d77ff" />
                </Pressable>
              </View>
              <Calendar
                minDate={new Date().toISOString().split("T")[0]}
                onDayPress={(day) => {
                  handleChange(
                    "preferredEndRangeDate",
                    day.dateString.split("T")[0]
                  );
                  setShowEndCalendar(false);
                }}
              />
            </View>
          </View>
        </Modal>

        <ResultsServiceMatcherFromAI
          visible={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          aiResponse={aiResponse}
        />
      </View>
    </View>
  );
};

export default AIServiceMatcherScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbf0fbff",
    padding: 14,
    paddingTop: 60,
  },
  container: {
    flex: 1,
    backgroundColor: "#fbf0fbff",
    borderRadius: 15,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 0.7,
    borderBottomColor: "#cfcfcfff",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8b1e99ff",
  },
  label: {
    fontSize: 16,
    color: "#741f6bff",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 13,
    color: "#741f6bff",
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    color: "#490245ff",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 15,
    color: "#741f6bff",
    fontWeight: "600",
  },
  searchBtn: {
    backgroundColor: "#601d77ff",
    padding: 14,
    borderRadius: 12,
    marginTop: 40,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  overlayScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 14,
  },
  calenderView: {
    width: width / 1.1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
  },
  calHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calenderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#741f6bff",
  },
});
