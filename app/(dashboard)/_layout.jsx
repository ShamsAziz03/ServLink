import { Tabs } from "expo-router";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#eddbf3ff",
          paddingTop: 10,
        },
      }}
    />
  );
};

export default DashboardLayout;
