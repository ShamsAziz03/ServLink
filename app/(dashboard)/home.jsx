import { View, Text, ScrollView, Image } from "react-native";
import { Link } from "expo-router";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.png";

const home = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: insets.top,
      }}
    >
      {/* the first view */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7eaf9ff",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ paddingTop: 40, paddingLeft: 10 }}>
          <Ionicons name="notifications" size={35} color="#57096fff" />
        </Link>
        <Image source={Logo} style={{ marginTop: 25 }} />
        <Ionicons
          name="search"
          size={35}
          color="#57096fff"
          style={{ marginTop: 40, paddingRight: 15 }}
        />
      </View>

      {/* the second view */}
      <View
        style={{
          flex: 6,
          backgroundColor: "#f7eaf9ff",
          padding: 10,
          paddingTop: 40,
        }}
      >
        <ScrollView>
          {/* to put circles */}
          <View
            style={[
              {
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: 120,
              },
              {
                top: 10,
                right: 250,
                backgroundColor: "rgba(171, 102, 186, 0.3)",
              },
            ]}
          />
          <View
            style={[
              {
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
              },
              { top: 10, left: 320, backgroundColor: "rgba(58, 6, 81, 0.4)" },
            ]}
          />
          {/* now texts */}

          <Text
            style={{
              color: "#2f154aff",
              fontSize: 30,
              paddingBottom: 10,
              fontFamily: "Inter-Black",
            }}
          >
            Trusted help, when and how you need it.
          </Text>
          <Text
            style={{
              color: "#3b2d4bff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ServLink connects you with trusted local professionals for every
            task — home, tech, care, or more. Book in minutes, chat directly,
            and get things done quickly and confidently.
          </Text>

          {/* now login-signup button */}
          <View
            style={{
              alignItems: "center",
              margin: 30,
            }}
          >
            <Link
              href="/login"
              style={{
                marginTop: 20,
                backgroundColor: "#750d83ff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#e4e0e6ff",
                  fontSize: 20,
                  fontFamily: "Inter-Black",
                }}
              >
                Join Us Now
              </Text>
            </Link>
          </View>

          <Text style={{ fontSize: 42 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default home;
