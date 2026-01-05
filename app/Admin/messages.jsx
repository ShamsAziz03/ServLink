import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: "#6c3483",
  secondary: "#b57edc",
  background: "#f6f1fa",
  card: "#ffffff",
  text: "#2e1a33",
  muted: "#9b8ca6",
};

export default function AdminContactMessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get("http://192.168.1.12:5000/api/get_contact_messages");
    setMessages(res.data);
  };

  const sendReply = async () => {
  if (!reply.trim()) return;

  try {
    await axios.post("http://192.168.1.12:5000/api/contact_reply", {
      contact_id: selected.id,
      reply,
    });

    if (selected.user_id) {  
      await axios.post("http://192.168.1.12:5000/api/users/send-notification", {
        userId: selected.user_id,
        title: "New Reply 💬",
        message: reply,
      });
    }

    setReply("");
    setModalVisible(false);
    fetchMessages();
  } catch (err) {
    console.error("Error sending reply or notification:", err);
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
        <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        {!item.replied && <View style={styles.dot} />}
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>

      <Text style={styles.date}>{item.created_at}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Contact Messages</Text>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Reply Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reply to Message</Text>

            <Text style={styles.modalLabel}>{selected?.name}</Text>
            <Text style={styles.modalMessage}>{selected?.message}</Text>

            <TextInput
              placeholder="Write your reply..."
              placeholderTextColor={COLORS.muted}
              style={styles.textArea}
              multiline
              value={reply}
              onChangeText={setReply}
            />

            <TouchableOpacity onPress={sendReply}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.sendBtn}
              >
                <Feather name="send" size={18} color="#fff" />
                <Text style={styles.sendText}>Send Reply</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 4,
  },
  row: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  email: { fontSize: 13, color: COLORS.muted },
  message: { marginTop: 8, color: COLORS.text },
  date: { marginTop: 6, fontSize: 12, color: COLORS.muted },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalLabel: { fontWeight: "bold", color: COLORS.text },
  modalMessage: { marginVertical: 10, color: COLORS.text },

  textArea: {
    height: 90,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  sendBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
