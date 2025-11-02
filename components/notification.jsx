import React, { useEffect, useState } from "react";
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

const Notification = ({ visible, onClose, user_id }) => {
  const [notifications, setNotifications] = useState([]);
  const userId = user_id;

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  //to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:5000/homeInfo/notifications/${userId}`
      );
      const fetchedData = await response.json();
      setNotifications(fetchedData[0]);
      console.log("Response:", fetchedData[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  //to delete data
  const deleteNotification = async (id) => {
    try {
      if (id != -1) {
        const response = await fetch(
          `http://10.0.2.2:5000/homeInfo/deleteNotification/${id}`,
          { method: "DELETE" }
        );
        const result = await response.json();
        if (response.ok) {
          console.log(result.message);
        } else {
          console.warn(result.message);
        }
      } else {
        const response = await fetch(
          `http://10.0.2.2:5000/homeInfo/deleteNotifications/${userId}`,
          { method: "DELETE" }
        );
        const result = await response.json();
        if (response.ok) {
          console.log(result.message);
        } else {
          console.warn(result.message);
        }
      }
      fetchNotifications();
    } catch (error) {
      console.error("Error In Delete!!!", error);
    }
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
                key={notification.notification_id}
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
                      deleteNotification(notification.notification_id);
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
              deleteNotification(-1);
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
