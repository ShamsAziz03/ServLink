import React, { useEffect, useState, useContext } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import MyCalendar from "../components/calendar";
import { SelectList } from "react-native-dropdown-select-list";
import ServiceProviderCard from "../components/serviceProviderCard";
import { AppContext } from "../context/AppContext";

const ServiceBooking = () => {
  const insets = useSafeAreaInsets();
  const [visible, setVisibility] = useState(false); //for calender
  const filters = [
    { value: "Recommended" },
    { value: "Price(Lowest to Highest)" },
    { value: "Price(Highest to Lowest)" },
  ];
  const { currentService, questionsAnswers, choosedDate } =
    useContext(AppContext);

  //for fetch service providers
  const [serviceProviders, setServiceProviders] = useState([]);
  const [originalServiceProviders, setOriginalServiceProviders] = useState([]);
  const fetchProviders = async () => {
    try {
      const service_id = currentService.service_id;
      const result = await fetch(
        `http://10.0.2.2:5000/bookingService/getServiceProviders/${service_id}`
      );
      const fetchedData = await result.json();
      setServiceProviders(fetchedData);
      setOriginalServiceProviders(fetchedData);
    } catch (err) {
      console.error("Error fetching service providers:", err);
    }
  };
  //to fetch each sp un ava dates
  const [providersUnAvaDates, setProvidersUnAvaDates] = useState([]);
  const fetchProvidersUnavailableDates = async () => {
    if (originalServiceProviders.length !== 0) {
      let SprovArray = [];
      originalServiceProviders.forEach((sp) => {
        SprovArray.push(sp.provider_id);
      });

      try {
        const result = await fetch(
          "http://10.0.2.2:5000/bookingService/getProvidersUnAvailableDates",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: SprovArray }),
          }
        );
        const data = await result.json();
        setProvidersUnAvaDates(data);
        console.log("Providers UnAva Dates:", data);
      } catch (err) {
        console.error("Error fetching service providers un ava dates:", err);
      }
    }
  };

  //to fetch each sp schedule
  const [providersSchedule, setProvidersSchedule] = useState([]);
  const fetchProvidersSchedule = async () => {
    if (originalServiceProviders.length !== 0) {
      let SprovArray = [];
      originalServiceProviders.forEach((sp) => {
        SprovArray.push(sp.provider_id);
      });

      try {
        const result = await fetch(
          "http://10.0.2.2:5000/bookingService/getProvidersSchedule",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: SprovArray }),
          }
        );
        const data = await result.json();
        setProvidersSchedule(data);
        console.log("Providers schedule:", data);
      } catch (err) {
        console.error("Error fetching service providers schedule:", err);
      }
    }
  };

  useEffect(() => {
    console.log(
      "question answers from ServiceBooking page = ",
      questionsAnswers
    );
    fetchProviders();
  }, []);

  const applyFilter = (selectedFilter) => {
    let sorted = [...originalServiceProviders];
    if (selectedFilter === "Price(Lowest to Highest)") {
      sorted.sort(
        (a, b) => parseFloat(a.base_price) - parseFloat(b.base_price)
      );
    } else if (selectedFilter === "Price(Highest to Lowest)") {
      sorted.sort(
        (a, b) => parseFloat(b.base_price) - parseFloat(a.base_price)
      );
    }
    setServiceProviders(sorted);
  };

  useEffect(() => {
    fetchProvidersUnavailableDates();
    fetchProvidersSchedule();
  }, [originalServiceProviders]);

  useEffect(() => {
    let updated = [...originalServiceProviders];
    providersUnAvaDates.forEach((obj) => {
      if (choosedDate === obj.date.split("T")[0]) {
        updated = updated.filter((sp) => sp.provider_id !== obj.provider_id);
      }
    });
    //to remove sp that can't work in selected day
    const date = new Date(choosedDate);
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const weekday = weekdays[date.getDay()];
    let availableProviders = [];

    providersSchedule.forEach((ps) => {
      if (ps.day_of_week === weekday) {
        availableProviders.push(ps.provider_id);
      }
    });

    updated = updated.filter((sp) =>
      availableProviders.includes(sp.provider_id)
    );

    setServiceProviders(updated);
  }, [choosedDate]);

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
              <FontAwesome name="calendar" size={17} color="#f2e0f5ff" />

              <MyCalendar
                visible={visible}
                onClose={() => setVisibility(false)}
              />
              <Text
                style={[
                  styles.text,
                  { fontSize: 15, paddingLeft: 10, color: "#f2e2f4ff" },
                ]}
              >
                Date
              </Text>
            </View>
          </Pressable>

          <View style={{ flex: 1, marginLeft: 50, zIndex: 2000 }}>
            <SelectList
              setSelected={(val) => applyFilter(val)}
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
                fontSize: 15,
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
                fontSize: 13,
                fontWeight: "900",
              }}
            />
          </View>
        </View>
        {/* list of service providers */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {serviceProviders.map((serviceProvider, index) => (
            <View key={index}>
              <ServiceProviderCard serviceProviderInfo={serviceProvider} />
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
