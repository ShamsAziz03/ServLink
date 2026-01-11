import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { AppContext } from "../../context/AppContext";

const mockInsights = {
  overall_status: "good",
  performance_score: 78,
  key_metrics: {
    completion_rate: 75,
    cancellation_rate: 25,
    booking_frequency: "medium",
  },
  strengths: [
    "Broad service portfolio (disabled care, babysitting, pet grooming).",
    "Consistent weekday availability with 8-hour shifts.",
    "Competitive pricing on disabled-home service.",
  ],
  weaknesses: [
    "Limited geographic coverage (Ramallah, Nablus, Bethlehem).",
    "25% cancellation rate.",
    "No deep-cleaning service despite rising demand.",
  ],
  recommendations: {
    pricing: [
      {
        service: "Babysitting",
        suggestion: "Increase base price to 27.50.",
        potential_impact: "+10% revenue per booking.",
      },
    ],
    services: [
      {
        add_service: "Deep-Cleaning for Offices",
        reason: "35% rise in search demand.",
      },
    ],
    coverage: [
      {
        add_cities: ["Hebron"],
        reason: "Competitor presence + rising demand.",
      },
    ],
    schedule: [
      {
        service: "Babysitting",
        suggestion: "Add Saturday 10:00-14:00",
        peak_hours: "10:00-14:00",
      },
    ],
    completion_improvement: [
      {
        recommendation: "Send automated confirmation + pre-service call.",
      },
    ],
  },
  priority_actions: [
    {
      action: "Expand coverage to Hebron & Jericho",
      impact: "high",
      effort: "moderate",
    },
  ],
};

const EnhanceWorkByAI = () => {
  const [insights, setInsights] = useState(mockInsights);
  const [loading, setLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const router = useRouter();
  const { loggedUser } = useContext(AppContext);

  const ip = process.env.EXPO_PUBLIC_IP;
  const API_ADDRESS = `http://${ip}:5000`;

  const fetchDataFromDB = async () => {
    try {
      const [
        bookingsRes,
        schedulesRes,
        providersRes,
        servicesRes,
        providerServicesRes,
        providerIdRes,
      ] = await Promise.all([
        fetch(`${API_ADDRESS}/providerBookings/getAllBooks`),
        fetch(`${API_ADDRESS}/providerBookings/getAllSchedules`),
        fetch(`${API_ADDRESS}/providerBookings/getAllProviders`),
        fetch(`${API_ADDRESS}/providerBookings/getAllServices`),
        fetch(`${API_ADDRESS}/providerBookings/getAllProviderServices`),
        fetch(
          `${API_ADDRESS}/providerBookings/getProviderID/${loggedUser.user_id}`
        ),
      ]);

      const [
        bookings,
        schedules,
        providers,
        services,
        provider_services,
        providerId,
      ] = await Promise.all([
        bookingsRes.json(),
        schedulesRes.json(),
        providersRes.json(),
        servicesRes.json(),
        providerServicesRes.json(),
        providerIdRes.text(),
      ]);

      return {
        providerId,
        bookings,
        schedules,
        providers,
        services,
        provider_services,
      };
    } catch (error) {
      console.error("fetchDataFromDB failed:", error);
      return null;
    }
  };

  const fetchAIPerformenceInsights = async () => {
    try {
      setLoading(true);
      const obj = await fetchDataFromDB();

      const result = await fetch(
        `${API_ADDRESS}/providerBookings/getAIPerformenceInsights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        }
      );

      const responseData = await result.json();

      if (result.status === 429) {
        // Rate limit exceeded
        if (responseData.cached) {
          setInsights(responseData.cached);
          setIsFromCache(true);
          Alert.alert(
            "Using Cached Data",
            `Too many requests. Showing previous analysis. Please wait ${responseData.waitTime || responseData.retryAfter || 10} seconds before refreshing.`
          );
        } else {
          Alert.alert(
            "Rate Limit Exceeded",
            `Please wait ${responseData.waitTime || responseData.retryAfter || 10} seconds before trying again.`
          );
        }
      } else if (result.ok) {
        setInsights(responseData);
        setIsFromCache(false);
        setLastUpdated(new Date());
      } else {
        if (responseData.cached) {
          setInsights(responseData.cached);
          setIsFromCache(true);
          Alert.alert(
            "Using Cached Data",
            "AI service temporarily unavailable. Showing previous analysis."
          );
        } else {
          throw new Error(responseData.message || "Failed to fetch insights");
        }
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error.message);
      Alert.alert(
        "Error",
        "Failed to load AI insights. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIPerformenceInsights();
  }, []);

  const getImpactIcon = (impact) => {
    if (impact === "high") return "fire";
    if (impact === "medium") return "bolt";
    if (impact === "low") return "lightbulb";
    return "flag";
  };

  const metrics = [
    {
      title: "Completion Rate",
      value: insights.key_metrics.completion_rate + "%",
      icon: "check-circle",
      color: "#2563eb",
    },
    {
      title: "Cancellation Rate",
      value: insights.key_metrics.cancellation_rate + "%",
      icon: "times-circle",
      color: "#db3218",
    },
    {
      title: "Booking Frequency",
      value:
        insights.key_metrics.booking_frequency === "high"
          ? "High"
          : insights.key_metrics.booking_frequency === "medium"
            ? "Medium"
            : "Low",
      icon: "calendar-alt",
      color: "#f59e0b",
    },
  ];

  return (
    <LinearGradient colors={["#edd2f0ff", "#f1ebf6"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#601d77" />
          </Pressable>
          <Text style={styles.headerTitle}>AI Performance Insights</Text>
          <Ionicons name="analytics" size={36} color="#601d77" />
        </View>

        {/* Cache Indicator */}
        {isFromCache && (
          <View style={styles.cacheIndicator}>
            <FontAwesome5 name="database" size={14} color="#f59e0b" />
            <Text style={styles.cacheText}>
              Showing cached data - Click refresh for new analysis
            </Text>
          </View>
        )}

        {/* Last Updated */}
        {lastUpdated && !isFromCache && (
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Last updated: {lastUpdated.toLocaleTimeString("ar-PS")}
            </Text>
          </View>
        )}

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#601d77" />
            <Text style={styles.loadingText}>Analyzing performance...</Text>
          </View>
        )}

        {/* Overall Status */}
        <View style={styles.statCardFull}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.statTitle}>Overall Status: </Text>
            <Text style={styles.statValue}>
              {insights.overall_status.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.statTitle, { marginTop: 8, fontWeight: "600" }]}>
            Performance Score: {insights.performance_score}/100
          </Text>
        </View>

        {/* Metrics */}
        <View style={styles.statsRow}>
          {metrics.map((m, i) => (
            <View key={i} style={styles.statCard}>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <FontAwesome5 name={m.icon} size={18} color={m.color} />
                <Text style={styles.statTitle}>{m.title}</Text>
              </View>
              <Text style={[styles.statValue, { marginTop: 7 }]}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Priority Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Priority Actions</Text>
          {insights.priority_actions.map((p, i) => (
            <View key={i} style={styles.priorityCard}>
              <View style={styles.row}>
                <FontAwesome5
                  name={getImpactIcon(p.impact)}
                  size={19}
                  color="#601d77"
                />
                <Text style={styles.listItem}>{p.action}</Text>
              </View>
              <Text style={styles.subText}>
                Impact: {p.impact} • Effort: {p.effort}
              </Text>
            </View>
          ))}
        </View>

        {/* Strengths & Weaknesses */}
        <View>
          <View style={[styles.card, { flex: 1, marginRight: 5 }]}>
            <Text style={styles.cardTitle}>Strengths</Text>
            {insights.strengths.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                • {s}
              </Text>
            ))}
          </View>
          <View style={[styles.card, { flex: 1, marginLeft: 5 }]}>
            <Text style={styles.cardTitle}>Weaknesses</Text>
            {insights.weaknesses.map((w, i) => (
              <Text key={i} style={styles.listItem}>
                • {w}
              </Text>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommendations</Text>

          {Object.entries(insights.recommendations).map(([section, items]) => (
            <View key={section} style={{ marginBottom: 12 }}>
              <Text style={styles.recommendationTitle}>
                {section.replace("_", " ").toUpperCase()}
              </Text>

              {items.map((item, i) => (
                <View key={i} style={styles.recommendationCard}>
                  {item.service && (
                    <View style={styles.row}>
                      <FontAwesome5 name="tag" size={16} color="#601d77" />
                      <Text style={styles.listItem}>{item.service}</Text>
                    </View>
                  )}

                  {item.add_service && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="plus-circle"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>{item.add_service}</Text>
                    </View>
                  )}

                  {item.add_cities && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>
                        {item.add_cities.join(", ")}
                      </Text>
                    </View>
                  )}

                  {item.suggestion && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="lightbulb"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>{item.suggestion}</Text>
                    </View>
                  )}

                  {item.potential_impact && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="chart-line"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>
                        {item.potential_impact}
                      </Text>
                    </View>
                  )}

                  {item.reason && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="info-circle"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>{item.reason}</Text>
                    </View>
                  )}

                  {item.peak_hours && (
                    <View style={styles.row}>
                      <FontAwesome5 name="clock" size={16} color="#601d77" />
                      <Text style={styles.listItem}>{item.peak_hours}</Text>
                    </View>
                  )}

                  {item.recommendation && (
                    <View style={styles.row}>
                      <FontAwesome5
                        name="exclamation-triangle"
                        size={16}
                        color="#601d77"
                      />
                      <Text style={styles.listItem}>{item.recommendation}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#601d77",
    width: "50%",
    textAlign: "center",
  },
  cacheIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  cacheText: {
    fontSize: 13,
    color: "#92400e",
    fontWeight: "600",
    flex: 1,
  },
  lastUpdated: {
    alignItems: "center",
    marginBottom: 10,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#601d77",
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fdf1ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  statCardFull: {
    backgroundColor: "#fdf1ff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  statTitle: { fontSize: 16, fontWeight: "700", color: "#7b3685" },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3f043b",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fdf1ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6c0268",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: "#713871",
    marginBottom: 7,
    fontWeight: "600",
    flexWrap: "wrap",
    width: "90%",
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#601d77",
    marginBottom: 6,
  },
  recommendationCard: {
    borderWidth: 1,
    borderColor: "#893696",
    backgroundColor: "#f4e5f9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  priorityCard: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  refreshButton: {
    backgroundColor: "#601d77",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  refreshButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  refreshButtonText: {
    color: "#e4e0e6",
    fontWeight: "700",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
});

export default EnhanceWorkByAI;
