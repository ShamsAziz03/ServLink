import { Drawer } from "expo-router/drawer";


export default function Layout() {
   const Colors = {
  primary: "#6c3483",
  secondary: "#94469dff",
  background: "#fff",
  card: "#6c3483",
  textSecondary: "#000",
};
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: Colors.background },
        drawerActiveTintColor: Colors.secondary,
        drawerInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="providers" options={{ title: "Service Providers" }} />
      <Drawer.Screen name="categories" options={{ title: "Categories" }} />
      <Drawer.Screen name="services" options={{ title: "Services" }} />
      <Drawer.Screen name="messages" options={{ title: "Messages" }} />
      <Drawer.Screen name="users" options={{ title: "Users" }} />
    </Drawer>
  );
}
