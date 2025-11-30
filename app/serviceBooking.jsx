import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import HeaderLogoReturn from "../components/headerLogoReturn";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MyCalendar from "../components/calendar";
import { SelectList } from "react-native-dropdown-select-list";

const ServiceBooking = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { answers } = route.params;
  const [visible, setVisibility] = useState(false); //for calender
  const [selectedFilter, setSelectedFilter] = useState("");
  const filters = [
    { value: "Recommended" },
    { value: "Price(Lowest to Highest)" },
    { value: "Price(Highest to Lowset)" },
    { value: "# of completed tasks" },
  ];

  useEffect(() => {
    console.log("answers from SB page = ", answers);
  }, []);
  useEffect(() => {
    console.log("selected filter= ", selectedFilter);
  }, [selectedFilter]);

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#d7afdcff"]}
      style={{ flex: 1, justifyContent: "space-between", padding: 20 }}
    >
      <View
        style={[
          styles.fullView,
          {
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <HeaderLogoReturn
          linkToReturn="questions"
          title="Booking Service"
          goToService={false}
        />

        {/* the conentent of the page */}
        {/* for the what user should do */}
        <View
          style={[
            styles.view,
            {
              backgroundColor: "#f1d3f5ff",
              padding: 15,
              borderRadius: 15,
              width: "100%",
            },
          ]}
        >
          <FontAwesome name="users" size={27} color="#7b3685ff" />
          <Text style={styles.text}>
            Filter and sort to find your Tasker. Then view their availability to
            request your date and time.
          </Text>
        </View>
        {/* choose date and filter */}
        <View style={{ flexDirection: "row", justifyContent:"space-between", marginTop:17}}>
          <Pressable
            onPress={() => {
              setVisibility((prev) => !prev);
            }}
          >
            <View
              style={[
                styles.view,
                {
                  backgroundColor: "#8b3694ff",
                  borderRadius: 15,
                  padding: 13,
                },
              ]}
            >
              <FontAwesome name="calendar" size={23} color="#f2e0f5ff" />

              <MyCalendar
                visible={visible}
                onClose={() => setVisibility(false)}
              />
              <Text
                style={[
                  styles.text,
                  { fontSize: 18, paddingLeft: 10, color: "#f2e2f4ff" },
                ]}
              >
                Date
              </Text>
            </View>
          </Pressable>

          {/* for filter options */}
          <SelectList
            setSelected={(val) => setSelectedFilter(val)}
            data={filters}
            placeholder="Select Filter"
            dropdownStyles={{ backgroundColor: "#e5cce7ff" }}
            dropdownTextStyles={{
              color: "#6c0268ff",
              fontSize: 17,
              fontWeight: "700",
            }}
            dropdownItemStyles={{ margin: 5 }}
            boxStyles={{
              borderRadius: 8,
              borderColor: "#797979ff",
              padding: 10,
            }}
            inputStyles={{
              color: "#6c0268ff",
              fontSize: 16,
              fontWeight: "700",
            }}
          />
        </View>
        {/* list of service providers */}
        <View style={{ alignItems: "center" }}></View>
      </View>
    </LinearGradient>
  );
};

export default ServiceBooking;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  text: {
    color: "#7b3685ff",
    fontSize: 15,
    fontWeight: "700",
    paddingLeft: 20,
  },
  view: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
