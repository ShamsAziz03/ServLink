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
  border: "#e5dff0",
};

export default function AdminContactMessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const ip = process.env.EXPO_PUBLIC_IP;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get(`http://${ip}:5000/api/get_contact_messages`);
    setMessages(res.data);
  };

  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(`http://${ip}:5000/api/contact_reply`, {
        contact_id: selected.id,
        reply,
      });

      if (selected.user_id) {
        await axios.post(`http://${ip}:5000/api/users/send-notification`, {
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
      <View style={styles.pageTitle}>
        <Text style={styles.pageTitleText}>Contact Messages</Text>
        <Text style={styles.pageSubtitle}>Manage & reply to user inquiries</Text>
      </View>


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

            <View style={styles.actionRow}>
              {/* Cancel */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setModalVisible(false);
                  setReply("");
                }}
              >
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </View>
              </TouchableOpacity>

              {/* Send */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={sendReply}
              >
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
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: 55,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  pageTitleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.6,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#8e8399",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },

  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },

  date: {
    marginTop: 10,
    fontSize: 11,
    color: COLORS.muted,
    alignSelf: "flex-end",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },

  modalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  modalMessage: {
    marginVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
  },

  textArea: {
    height: 100,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    padding: 14,
    fontSize: 14,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },


actionRow: {
  flexDirection: "row",
  gap: 12,
  marginTop: 12,
},

actionBtn: {
  flex: 1,          // ⭐ السر هون
},

cancelBtn: {
  height: 50,
  borderRadius: 16,
  borderWidth: 1.5,
  borderColor: COLORS.muted,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
},

sendBtn: {
  height: 50,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  borderRadius: 16,
  shadowColor: COLORS.primary,
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 6,
},
});
