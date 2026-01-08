import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BackButton = ({
  goTo = null,
  params = null,
  size = 35,
  color = "#7b3685ff",
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (goTo) {
      router.push({ pathname: goTo, params: params });
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Ionicons name="arrow-back-outline" size={size} color={color} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    padding: 30,
    marginTop: 40,
  },
});
