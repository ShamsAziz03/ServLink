import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const ImageModal = ({ visible, onClose, img }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* all over screen */}
      <View style={styles.overlayScreen}>
        {/* image show screen */}
        <View style={styles.imageShow}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Pressable onPress={onClose} style={styles.cancle}>
              <MaterialIcons name="clear" size={30} color="#fcedfdff" />
            </Pressable>
          </View>
          <Image
            source={{ uri: img }}
            style={{ width: 350, height: 320, borderRadius: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  overlayScreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    height: "100%",
  },
  imageShow: {
    flexDirection: "column",
    gap: 20,
    borderRadius: 15,
  },
  cancle: { paddingRight: 20 },
});
