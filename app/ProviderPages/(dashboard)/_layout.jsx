import { Ionicons, MaterialIcons} from "@expo/vector-icons";
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
        name="providerDashboard"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              size={30}
              name="dashboard"
              color={focused ? "#1c0223ff" : "#96859bff"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="providerServicesList"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={30}
              name={"construct-outline"}
              color={focused ? "#1c0223ff" : "#6d5e72ff"}
            />
          ),
        }}
      />
           <Tabs.Screen
        name="myTasks"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              size={30}
              name={"checklist"}
              color={focused ? "#1c0223ff" : "#6d5e72ff"}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profileUser"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list"
              size={30}
              color={focused ? "#1c0223ff" : "#6d5e72ff"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
