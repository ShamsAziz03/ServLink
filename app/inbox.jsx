import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


const COLORS = {
  primary: "#6c3483",
  secondary: "#b57edc",
  background: "#f6f1fa",
  card: "#fff",
  text: "#2e1a33",
  muted: "#9b8ca6",
};

export default function InboxScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
  

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(storedUser);
      const userId = user.user_id;
      const res = await axios.get(
        `http://192.168.1.12:5000/api/users/user_inbox/${userId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Mark message as read
 const markAsRead = async (replyId) => {
  console.log("Marking as read ID:", replyId); // صحح الاسم
  if (!replyId) return;

  try {
    await axios.put(`http://192.168.1.12:5000/api/users/mark-read/${replyId}`);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.reply_id === replyId ? { ...msg, read: 1 } : msg
      )
    );
  } catch (err) {
    console.log(err);
  }
};


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelected(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.row}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={28}
          color={COLORS.primary}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.reply_title || "Admin Reply"}</Text>
          <Text style={styles.preview} numberOfLines={1}>
            {item.reply || "No reply yet..."}
          </Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </View>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/profileUser")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
      </LinearGradient>

      {/* Messages list */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.reply_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Modal to show full message */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {selected?.reply_title || "Admin Reply"}
              </Text>
              <Text style={styles.modalContent}>
                {selected?.reply || "No reply yet"}
              </Text>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  markAsRead(selected?.reply_id); // Mark read عند الإغلاق
                  setModalVisible(false);
                }}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 6 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 30,
  },

  // Message Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  preview: { color: COLORS.muted },
  date: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.primary, marginBottom: 12 },
  modalContent: { color: COLORS.text, fontSize: 15, marginBottom: 20 },

  closeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});
