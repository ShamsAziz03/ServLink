import { Ionicons, Octicons, AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f7eaf9ff",
          borderTopColor: "#601d77ff",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={27}
              color={focused ? "#320540ff" : "#6e5f74ff"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="myTasker"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={27}
              name="heart"
              color={focused ? "#320540ff" : "#6e5f74ff"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings-sharp"
              size={27}
              color={focused ? "#320540ff" : "#6e5f74ff"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Octicons
              size={27}
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
