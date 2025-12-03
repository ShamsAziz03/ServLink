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
import ServiceProviderCard from "../components/serviceProviderCard";

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

  // Add service providers array
  const serviceProviders = [
    {
      name: "Sara Zahi",
      price: 80,
      img: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
      rating: 4,
      description:
        "Expert in home and office cleaning services, including deep cleaning and maintenance.",
    },
    {
      name: "ahmad omar",
      price: 120,
      img: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
      rating: 3,
      description:
        "Skilled in assembling all types of furniture efficiently and safely.",
    },
    {
      name: "ahmad omar",
      price: 120,
      img: "http://10.0.2.2:5000/assets/topProviders/icon1.jpg",
      rating: 3,
      description:
        "Skilled in assembling all types of furniture efficiently and safely.",
    },
  ];

  useEffect(() => {
    console.log("answers from SB page = ", answers);
  }, []);
  useEffect(() => {
    console.log("selected filter= ", selectedFilter);
  }, [selectedFilter]);

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#e8d0ebff"]}
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
              backgroundColor: "#f4def7ff",
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 17,
            zIndex: 1000,
          }}
        >
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
                  borderRadius: 5,
                  padding: 10,
                },
              ]}
            >
              <FontAwesome name="calendar" size={21} color="#f2e0f5ff" />

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

          <View style={{ flex: 1, marginLeft: 50, zIndex: 2000 }}>
            <SelectList
              setSelected={(val) => setSelectedFilter(val)}
              data={filters}
              placeholder="Select Filter"
              dropdownStyles={{
                backgroundColor: "#efe5f0ff",
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                zIndex: 9999,
                elevation: 100,
                maxHeight: 250,
              }}
              dropdownTextStyles={{
                color: "#6c0268ff",
                fontSize: 19,
                fontWeight: "700",
                borderTopColor: "#eee9e9ff",
                borderRightColor: "#f1ececff",
                borderLeftColor: "#f5f1f1ff",
                borderBottomColor: "#858181ff",
                borderWidth: 0.5,
                textAlign: "center",
              }}
              dropdownItemStyles={{ marginHorizontal: 3 }}
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
        </View>
        {/* list of service providers */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {serviceProviders.map((serviceProvider, index) => (
            <View key={index}>
              <ServiceProviderCard
                name={serviceProvider.name}
                price={serviceProvider.price}
                img={serviceProvider.img}
                rating={serviceProvider.rating}
                description={serviceProvider.description}
              />
            </View>
          ))}
        </ScrollView>
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
