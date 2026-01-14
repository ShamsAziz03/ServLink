import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

function Row({ label, value }) {
  const v =
    value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{v}</Text>
    </View>
  );
}

function Column({ label, value }) {
  const v =
    value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <View
      style={{
        flexDirection: "column",
        gap: 10,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderBottomWidth: 0,
        width: "48%",
      }}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={{
          textAlign: "center",
          color: "#2c002cff",
          fontWeight: "900",
          fontSize: 14,
        }}
      >
        {v}
      </Text>
    </View>
  );
}

export default function ResultsServiceMatcherFromAI({
  aiResponse,
  onClose,
  visible,
}) {
  const { setCurrentService, setCurrentProviderInfo } = useContext(AppContext);
  const navigation = useNavigation();

  const requestAnalysis = aiResponse?.data?.requestAnalysis;
  const matchedProviders = aiResponse?.data?.matchedProviders || [];

  const handleBooking = (provider) => {
    const obj = {
      service_id: provider.servicesMatch.relevantServices[0].serviceId,
      category_id: requestAnalysis.categoryId,
      title: requestAnalysis.serviceType,
    };
    setCurrentService(obj);

    const providerServiceInfo = {
      provider_id: provider.providerId,
      base_price: provider.servicesMatch.relevantServices[0].price,
      service_id: provider.servicesMatch.relevantServices[0].serviceId,
    };
    setCurrentProviderInfo(providerServiceInfo);

    navigation.navigate("userLocation");
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {aiResponse?.success && (
            <ScrollView contentContainerStyle={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>AI Analysis</Text>
                <Pressable onPress={onClose}>
                  <MaterialIcons name="clear" size={28} color="#601d77ff" />
                </Pressable>
              </View>

              {/* Request Analysis Card */}
              <View style={styles.card}>
                <Text style={styles.title}>Request Analysis</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Column
                    label="Service Type"
                    value={requestAnalysis?.serviceType}
                  />
                  <Column
                    label="Detected Service Names"
                    value={(requestAnalysis?.detectedServiceNames || []).join(
                      ", "
                    )}
                  />
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Column
                    label="Detected Category"
                    value={requestAnalysis?.detectedCategory}
                  />
                  <Column
                    label="Urgency"
                    value={requestAnalysis?.urgencyLevel}
                  />
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Column
                    label="Complexity"
                    value={requestAnalysis?.complexityLevel}
                  />
                  <Column
                    label="Estimated Duration"
                    value={requestAnalysis?.estimatedDuration}
                  />
                </View>
                <Text style={styles.subTitle}>Key Requirements</Text>
                <View style={styles.subBox}>
                  {(requestAnalysis?.keyRequirements || []).length ? (
                    requestAnalysis.keyRequirements.map((r, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {r}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.text}>—</Text>
                  )}
                </View>
              </View>

              {/* Providers */}
              <Text style={styles.sectionHeader}>
                Matched Providers ({matchedProviders.length})
              </Text>

              {matchedProviders.map((p, index) => {
                const matchScorePct = Math.round(p.matchScore || 0);

                return (
                  <View key={index} style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeaderRow}>
                      <View style={{ flexDirection: "row", gap: 20 }}>
                        <View style={styles.rankCircle}>
                          <Text style={styles.rankText}>{index + 1}</Text>
                        </View>

                        <View>
                          <Text style={styles.providerName}>
                            {p.providerUserName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "900",
                              color: "rgb(79, 25, 86)",
                            }}
                          >
                            {p.UserPhone}
                          </Text>
                        </View>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.score}>{matchScorePct}%</Text>
                        <Text style={styles.scoreLabel}> Match</Text>
                      </View>
                    </View>

                    {/* Availability */}
                    <Text style={styles.subTitle}>Availability</Text>
                    <View style={styles.subBox}>
                      <Row
                        label="Available on requested date"
                        value={
                          p.availabilityStatus?.isAvailableOnRequestedDate
                            ? "Yes"
                            : "No"
                        }
                      />

                      <Text style={styles.smallTitle}>
                        Available Time Slots
                      </Text>
                      {(p.availabilityStatus?.availableTimeSlots || [])
                        .length ? (
                        p.availabilityStatus.availableTimeSlots.map((t, i) => (
                          <Text key={i} style={styles.bullet}>
                            • {t?.date || "—"}
                            {t?.startTime ? `  At  ${t.startTime}` : ""}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.text}>—</Text>
                      )}
                    </View>
                    {/* Services Match */}
                    <Text style={styles.subTitle}>Services Match</Text>
                    <View style={styles.subBox}>
                      {(p.servicesMatch?.relevantServices || []).length ? (
                        p.servicesMatch.relevantServices.map((s, i) => (
                          <Text key={i} style={styles.bullet}>
                            • {s?.serviceName || "—"} | Price: {s?.price ?? "—"}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.text}>—</Text>
                      )}
                    </View>
                    {/* Strengths */}
                    <Text style={styles.subTitle}>Strengths</Text>
                    <View style={styles.subBox}>
                      {(p.strengths || []).length ? (
                        p.strengths.map((s, i) => (
                          <Text key={i} style={styles.bullet}>
                            • {s}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.text}>—</Text>
                      )}
                    </View>

                    {/* Book Now */}
                    <Pressable
                      style={styles.bookBtn}
                      onPress={() => {
                        handleBooking(p);
                      }}
                    >
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {!aiResponse.success && (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>AI Analysis</Text>
                <Pressable onPress={onClose}>
                  <MaterialIcons name="clear" size={28} color="#601d77ff" />
                </Pressable>
              </View>
              <Text style={styles.title}>No Results</Text>
              <Text style={styles.text}>Response was not successful.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 5, 20, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "#fbf0fbff",
    width: "92%",
    height: "95%",
    borderRadius: 22,
    padding: 16,
    elevation: 10,
  },

  content: {
    paddingBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ead7eeff",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#8b1e99ff",
    marginBottom: 10,
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#741f6bff",
  },

  card: {
    backgroundColor: "#ebd2ef",
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    borderWidth: 0,
    shadowColor: "#2a0731",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  subTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "900",
    color: "#741f6bff",
  },

  smallTitle: {
    marginTop: 5,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: "#741f6bff",
  },

  subBox: {
    backgroundColor: "rgb(245, 235, 248)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1dff5",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderBottomWidth: 0,
  },

  rowLabel: {
    flex: 1,
    color: "#6b1e6aff",
    fontWeight: "900",
    fontSize: 13,
  },

  rowValue: {
    flex: 1,
    textAlign: "right",
    color: "#2c002cff",
    fontWeight: "900",
    fontSize: 14,
  },

  text: {
    color: "#2c002cff",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
  },

  bullet: {
    color: "#2c002cff",
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  rankCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#8b1e99ff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#8b1e99ff",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  rankText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
  },

  providerName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    color: "#2c002cff",
  },

  score: {
    fontSize: 24,
    fontWeight: "900",
    color: "#8b1e99ff",
  },

  scoreLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6b3b6b",
    marginTop: 2,
  },

  bookBtn: {
    backgroundColor: "#601d77ff",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 14,
    alignItems: "center",

    shadowColor: "#601d77ff",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },

  bookBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
