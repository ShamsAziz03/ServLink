import { React, useState, useContext, useEffect } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppContext } from "../../../context/AppContext";
import Notification from "../../../components/notification";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

const ProviderDashboard = () => {
  const insets = useSafeAreaInsets();
  const { loggedUser } = useContext(AppContext);
  const [visible, setVisibility] = useState(false);
  const API_ADDRESS = "http://10.0.2.2:5000";
  const [providerStats, setProviderStats] = useState({
    rating: 0,
    numOfCompletedOrders: 0,
    numOfPendingOrders: 0,
    numOfCancelledOrders: 0,
    profits: 0.0,
  });

  const stats = [
    {
      title: "Earnings",
      value: providerStats.profits,
      icon: "dollar-sign",
      color: "#16a34a",
    },
    {
      title: "Completed Orders",
      value: providerStats.numOfCompletedOrders,
      icon: "check-circle",
      color: "#2563eb",
    },
    {
      title: "Rating",
      value: providerStats.rating,
      icon: "star",
      color: "#f59e0b",
    },
    {
      title: "Pending Orders",
      value: providerStats.numOfPendingOrders,
      icon: "clock",
      color: "#ea580c",
    },
    {
      title: "Cancelled Orders",
      value: providerStats.numOfCancelledOrders,
      icon: "times-circle",
      color: "#db3218ff",
    },
  ];

  const earningsData = [
    { month: "Jan", earnings: 2400 },
    { month: "Feb", earnings: 2800 },
    { month: "Mar", earnings: 3200 },
    { month: "Apr", earnings: 2900 },
    { month: "May", earnings: 3450 },
    { month: "Jun", earnings: 3800 },
  ];

  const servicesData = [
    { name: "Electricity", orders: 45 },
    { name: "Plumbing", orders: 32 },
    { name: "Carpentry", orders: 28 },
    { name: "Cleaning", orders: 25 },
  ];

  const orderStatusData = [
    {
      name: "Completed",
      value: 42,
      color: "#16a34a",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "In Progress",
      value: 8,
      color: "#2563eb",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Pending",
      value: 5,
      color: "#f59e0b",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffffff",
    backgroundGradientTo: "#f4def7ff",
    color: (opacity = 1) => `rgba(123, 54, 133, ${opacity})`,
    labelColor: () => "#6c0268ff",
    strokeWidth: 2,
  };

  const fetch_rating_orders_earnings = async () => {
    try {
      const response = await fetch(
        // `${API_ADDRESS}/serviceProviderStats/getProviderRatingOrdersEarning/${loggedUser.user_id}`////////////////////////////////to change
        `${API_ADDRESS}/serviceProviderStats/getProviderRatingOrdersEarning/3`
      );
      const fetchedData = await response.json();
      setProviderStats((prev) => ({
        ...prev,
        rating: fetchedData.rating,
        profits: fetchedData.totalProfits,
        numOfCompletedOrders: fetchedData.numOfOrders,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetch_pending_cancelled_orders = async () => {
    try {
      const response = await fetch(
        // `${API_ADDRESS}/serviceProviderStats/getProviderCancelledPendingOrders/${loggedUser.user_id}`////////////////////////////////to change
        `${API_ADDRESS}/serviceProviderStats/getProviderCancelledPendingOrders/1`
      );
      const fetchedData = await response.json();
      setProviderStats((prev) => ({
        ...prev,
        numOfPendingOrders: fetchedData.numOfPendingsOrders,
        numOfCancelledOrders: fetchedData.numOfCancelledOrders,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetch_rating_orders_earnings();
    fetch_pending_cancelled_orders();
  }, []);

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 30,
          paddingRight: insets.right,
          paddingLeft: insets.left,
          marginBottom: 30,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Notification
            user_id={loggedUser.user_id}
            visible={visible}
            onClose={() => setVisibility(false)}
          />
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                setVisibility((prev) => !prev);
              }}
            >
              <Ionicons name="notifications" size={30} color="#601d77ff" />
            </Pressable>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "900",
                color: "#601d77ff",
              }}
            >
              ServLink
            </Text>
            <Link
              href={{
                pathname: "/searchPage",
                params: { pageToBack: "/ProviderPages/providerDashboard" },
              }}
            >
              <Ionicons name="search" size={30} color="#601d77ff" />
            </Link>
          </View>

          {/* Header */}
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            {loggedUser &&
              "Welcome back, " +
                loggedUser.first_name +
                " " +
                loggedUser.last_name}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 10,
                    marginRight: 30,
                  }}
                >
                  <FontAwesome5 name={item.icon} size={22} color={item.color} />
                  <Text style={styles.statTitle}>{item.title}</Text>
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Monthly Earnings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Earnings</Text>
            <LineChart
              data={{
                labels: earningsData.map((e) => e.month),
                datasets: [{ data: earningsData.map((e) => e.earnings) }],
              }}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>

          {/* Services Performance */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Services Performance</Text>
            <BarChart
              data={{
                labels: servicesData.map((s) => s.name),
                datasets: [{ data: servicesData.map((s) => s.orders) }],
              }}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
            />
          </View>

          {/* Order Status */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Status</Text>
            <PieChart
              data={orderStatusData}
              width={screenWidth - 80}
              height={220}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              chartConfig={chartConfig}
            />
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default ProviderDashboard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#601d77ff",
    marginTop: 25,
  },
  subtitle: {
    color: "#7b3685ff",
    marginBottom: 20,
    fontWeight: "600",
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fdf1ffff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  statTitle: {
    color: "#7b3685ff",
    fontWeight: "700",
    marginTop: 4,
    fontSize: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3f043bff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fdf1ffff",
    padding: 15,
    borderRadius: 15,
    marginTop: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6c0268ff",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 60,
    marginLeft: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: "#888",
    borderBottomWidth: 0.8,
  },
});
