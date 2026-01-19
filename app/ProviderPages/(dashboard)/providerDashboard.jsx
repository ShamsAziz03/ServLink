import { React, useState, useContext, useEffect } from "react";
import { Link, useRouter } from "expo-router";
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loggedUser } = useContext(AppContext);
  const [visible, setVisibility] = useState(false);
  const ip = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${ip}:5000`;
  const [providerStats, setProviderStats] = useState({
    rating: 0,
    numOfCompletedOrders: 0,
    numOfPendingOrders: 0,
    numOfCancelledOrders: 0,
    profits: 0.0,
  });

  //for service performence, each service that sp produce and how many bookings for each one
  const [servicesData, setServicesData] = useState([
    { name: "Electricity", orders: 45 },
    { name: "Plumbing", orders: 32 },
    { name: "Carpentry", orders: 28 },
    { name: "Cleaning", orders: 25 },
  ]);

  const [earningsData, setEarningsData] = useState([
    {
      name: "Helping disabled at home",
      service_date: "2025-09-20",
      total_price: "1000.00",
      user_id: 1,
    },
    {
      name: "Baby Sitting",
      service_date: "2025-02-01",
      total_price: "1200.00",
      user_id: 1,
    },
  ]);
  const [earningsData2, setEarningsData2] = useState([
    { month: "Jan", earnings: 240 },
    { month: "Mar", earnings: 320 },
  ]);
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

  const orderStatusData = [
    {
      name: "Completed",
      value: Number(providerStats.numOfCompletedOrders),
      color: "#16a34a",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Cancelled",
      value: Number(providerStats.numOfCancelledOrders),
      color: "#de1212ff",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Pending",
      value: Number(providerStats.numOfPendingOrders),
      color: "#f59e0b",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffffff",
    backgroundGradientTo: "#fdf0ffff",
    color: (opacity = 1) => `rgba(123, 54, 133, ${opacity})`,
    labelColor: () => "#5b0258ff",
    fillShadowGradientOpacity: 0.7,
    strokeWidth: 3,
    propsForLabels: {
      fontSize: 12,
      fontWeight: "900",
    },
  };

  const [cancelledBooks, setCancelledBooks] = useState(0);

  const fetch_rating_orders_earnings = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderStats/getProviderRatingOrdersEarning/${loggedUser.user_id}`,
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
        `${API_ADDRESS}/serviceProviderStats/getProviderCancelledPendingOrders/${loggedUser.user_id}`,
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

  const fetch_service_performance = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderStats/getProviderServicePerformance/${loggedUser.user_id}`,
      );
      const fetchedData = await response.json();
      setServicesData(fetchedData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetch_provider_monthly_earnings = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderStats/getProviderMonthlyEarnings/${loggedUser.user_id}`,
      );
      const fetchedData = await response.json();
      const formattedData = fetchedData.map((d) => ({
        ...d,
        service_date: d.service_date.split("T")[0],
      }));
      setEarningsData(formattedData);
      console.log(earningsData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetch_cancelled_books = async () => {
    try {
      const response = await fetch(
        `${API_ADDRESS}/serviceProviderStats/getCancelledBooks/${loggedUser.user_id}`,
      );
      const fetchedData = await response.json();
      setCancelledBooks(fetchedData.length);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetch_rating_orders_earnings();
    fetch_pending_cancelled_orders();
    fetch_service_performance();
    fetch_provider_monthly_earnings();
    fetch_cancelled_books();
  }, []);

  const getEarningsByMonth = () => {
    let arr = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const earningsByMonth = {};
    for (let i = 0; i < earningsData.length; i++) {
      const bookMonth = new Date(earningsData[i].service_date).getMonth();
      const monthString = monthNames[bookMonth];
      if (!earningsByMonth[monthString]) earningsByMonth[monthString] = 0;
      earningsByMonth[monthString] += parseFloat(earningsData[i].total_price);
    }

    for (const month in earningsByMonth) {
      if (earningsByMonth.hasOwnProperty(month)) {
        const obj = {
          month: month,
          earnings: earningsByMonth[month],
        };
        arr.push(obj);
      }
    }
    console.log(arr);
    setEarningsData2(arr);
  };

  useEffect(() => {
    getEarningsByMonth();
  }, [earningsData]);

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
            {loggedUser.first_name &&
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
          <Pressable
            style={{
              marginTop: 15,
              padding: 10,
              backgroundColor: "#893696ff",
              borderRadius: 10,
              textAlign: "center",
              width: screenWidth * 0.7,
              alignSelf: "center",
            }}
            onPress={() => {
              router.push("/ProviderPages/enhanceWorkByAI");
            }}
          >
            <Text
              style={{
                color: "#e4e0e6ff",
                fontSize: 17,
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Enhance My Work Using AI
            </Text>
          </Pressable>

          {cancelledBooks > 0 && (
            <View style={styles.container2}>
              <View style={styles.header2}>
                <Ionicons name="warning-outline" size={27} color="#c62828" />
                <Text style={styles.title2}>
                  Important Warning: Cancelling bookings affects your
                  reputation!
                </Text>
              </View>

              {/* Points */}
              <View style={styles.points}>
                <Text style={styles.point}>
                  {"You have : " + cancelledBooks.length + " Cancelled Books!"}
                </Text>
                <Text style={styles.point}>
                  • Each cancellation adds a negative record to your account
                </Text>
                <Text style={styles.point}>
                  • Repeated cancellations may lead to account Block
                </Text>
              </View>
            </View>
          )}

          {/* Services Performance */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Services Performance</Text>
            <BarChart
              data={{
                labels: servicesData.map((s) =>
                  s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name,
                ),
                datasets: [
                  { data: servicesData.map((s) => parseInt(s.totalBookings)) },
                ],
              }}
              width={screenWidth - 80}
              height={240}
              chartConfig={chartConfig}
              fromZero={true}
              showValuesOnTopOfBars={true}
              formatYLabel={(yValue) => parseInt(yValue, 10).toString()}
            />
          </View>

          {/* Monthly Earnings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Earnings</Text>
            <LineChart
              data={{
                labels: earningsData2.map((e) => e.month),
                datasets: [{ data: earningsData2.map((e) => e.earnings) }],
              }}
              width={screenWidth - 80}
              height={240}
              chartConfig={chartConfig}
              bezier
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
  container2: {
    backgroundColor: "#fff5f5",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 17,
  },

  header2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },

  title2: {
    color: "#b71c1c",
    fontWeight: "700",
    fontSize: 17,
    flex: 1,
    marginBottom: 5,
  },

  points: {
    marginBottom: 10,
  },

  point: {
    color: "#c62828",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
    fontWeight: "600",
  },
});
