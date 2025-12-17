import { Stack } from "expo-router";
import AppProvider from "../context/AppContext";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppProvider>
    </PaperProvider>
  );
}
