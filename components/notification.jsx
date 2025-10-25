import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Notification = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Friend Request",
      message: "Anna sent you a friend request",
      sent_at: new Date("2025-10-25T08:30:00"),
    },
    {
      id: "2",
      title: "System Alert",
      message: "Your password will expire in 3 days",
      sent_at: new Date("2025-10-25T09:15:00"),
    },
    {
      id: "3",
      title: "Promotion",
      message: "Get 20% off on your next purchase",
      sent_at: new Date("2025-10-25T10:00:00"),
    },
    {
      id: "4",
      title: "Message Alert",
      message: "New message from Mike",
      sent_at: new Date("2025-10-25T10:45:00"),
    },
    {
      id: "5",
      title: "Payment Confirmation",
      message: "Your payment of $120 was successful",
      sent_at: new Date("2025-10-25T11:30:00"),
    },
    {
      id: "6",
      title: "Event Reminder",
      message: "Meeting with Sarah at 3 PM",
      sent_at: new Date("2025-10-25T12:15:00"),
    },
    {
      id: "7",
      title: "System Update",
      message: "Version 2.1.0 is available for download",
      sent_at: new Date("2025-10-25T13:00:00"),
    },
  ]);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* new screen (overlay) */}
      <View style={styles.overlayScreen}>
        {/* content of screen */}
        <View
          style={[
            styles.notificationView,
            { width: width / 1.3, height: height - 70 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 25,
            }}
          >
            <Text style={styles.title}>Notifications</Text>
            <Pressable onPress={onClose} style={styles.cancle}>
              <MaterialIcons name="clear" size={30} color="#601d77ff" />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {notifications.map((notification) => (
              <View
                key={notification.id}
                style={{
                  backgroundColor: "#f3e8f7ff",
                  padding: 20,
                  margin: 10,
                  marginHorizontal: 25,
                  borderRadius: 10,
                  shadowColor: "#593962ff",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.6,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: "#4d045d88",
                      fontWeight: "bold",
                    }}
                  >
                    {notification.title}
                  </Text>
                  <Pressable
                    onPress={() => {
                      deleteNotification(notification.id);
                    }}
                  >
                    <MaterialIcons name="clear" size={20} color="#601d77ff" />
                  </Pressable>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#6f2b8088",
                  }}
                >
                  {notification.message}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#856b8c88",
                  }}
                >
                  {notification.sent_at.toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Pressable
            onPress={() => {
              setNotifications([]);
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                backgroundColor: "#4c025cff",
                color: "#ffffffff",
                marginBottom: 10,
                marginHorizontal: 70,
                borderRadius: 30,
                padding: 3,
                textAlign: "center",
              }}
            >
              Clear All
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Notification;

const styles = StyleSheet.create({
  overlayScreen: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  notificationView: {
    margin: 10,
    marginBottom: 70,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cancle: { paddingLeft: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d4bff",
    paddingLeft: 50,
  },
});
