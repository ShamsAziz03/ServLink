import { Ionicons, Octicons, Foundation } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#d2bcd9ff",
          paddingTop: 10,
          hight: 90,
        },
        tabBarActiveTintColor: "#601d77ff",
        tabBarInactiveTintColor: "#856a94ff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons size={24} name={focused ? "home" : "home-outline"} />
          ),
        }}
      />

      <Tabs.Screen
        name="myTasker"
        options={{
          title: "My Taskers",
          tabBarIcon: ({ focused }) => (
            <Ionicons size={24} name={focused ? "heart" : "heart-outline"} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons size={24} name={focused ? "person" : "person-outline"} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ focused }) => (
            <Octicons
              size={24}
              name={"tasklist"}
              color={focused ? "#320540ff" : "#6e5f74ff"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
