import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function WalletScreen({ provider_id }) {
  const [wallet, setWallet] = useState({ balance: 0, debt: 0 });
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const ip = process.env.EXPO_PUBLIC_IP;

  // Load wallet data
  const loadWallet = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const id = provider_id || user.provider_id;

      const res = await axios.get(
        `http://${ip}:5000/api/provider/wallet/${id}`,
      );
      setWallet({
        balance: Number(res.data.balance) || 0,
        debt: Number(res.data.debt) || 0,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to load wallet");
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  // Pay debt
  const payDebt = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0)
      return Alert.alert("Invalid", "Enter a valid amount");
    if (numAmount > wallet.debt)
      return Alert.alert("Error", "Amount exceeds debt");
    if (numAmount > wallet.balance)
      return Alert.alert("Error", "Insufficient balance");

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const id = provider_id || user.provider_id;

      await axios.post(`http://${ip}:5000/api/provider/wallet/pay-debt`, {
        provider_id: id,
        amount: numAmount,
      });

      Alert.alert("Success", "Debt paid successfully");
      setAmount("");
      loadWallet();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to pay debt");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back / Cancel Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="wallet"
          size={28}
          color="#6c3483"
          style={{ marginRight: 8 }}
        />
        <Text style={{ fontSize: 26, fontWeight: "bold", color: "#6c3483" }}>
          My Wallet
        </Text>
      </View>

      {/* Wallet Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="cash-outline" size={28} color="#6c3483" />
          <Text style={styles.label}>
            Balance: {wallet.balance.toFixed(2)} ₪
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="alert-circle-outline" size={28} color="#c0392b" />
          <Text style={styles.label}>Debt: {wallet.debt.toFixed(2)} ₪</Text>
        </View>
      </View>

      {/* Pay Debt Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💳 Transfer / Pay Debt</Text>

        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.btn} onPress={payDebt}>
          <Ionicons
            name="card-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.btnText}>Pay Debt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0e6fa",
    marginTop: 30,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6c3483",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6c3483",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#6c3483",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#6c3483",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    color: "#333",
    fontSize: 16,
    backgroundColor: "#fff",
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c3483",
    padding: 16,
    borderRadius: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
