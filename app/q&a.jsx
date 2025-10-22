import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I create a new account?",
      answer:
        "You can create an account by tapping the 'Sign Up' button on the home page and filling in your personal information such as name, email, and password.",
    },
    {
      question: "How can I add my service as a provider?",
      answer:
        "During registration, select the option to be a service provider, then enter your service type, working hours, and upload sample work.",
    },
    {
      question: "Can I edit my profile after registration?",
      answer:
        "Yes, you can edit your personal information and services from the settings page in the app.",
    },
    {
      question: "Is the app free to use?",
      answer:
        "Yes, signing up and using the main features of the app are completely free. Premium features may be added later.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our support team through the 'Contact Us' page in the app or via our official email.",
    },
  ];

  const toggleFAQ = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <LinearGradient
      colors={["#e0c3f2ff", "#b57edcff", "#f5e1ffff"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
  <View style={styles.header}>
    
    <Text style={styles.title}>Frequently Asked Questions </Text>
    <Image
      source={{ uri: "https://cdn-icons-png.flaticon.com/128/11732/11732731.png" }}
      style={{ width: 28, height: 28, marginRight: 10 ,marginTop:-25 }}
      resizeMode="contain"
    />
  </View>
        {faqs.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              openIndex === index && styles.cardOpen,
            ]}
            onPress={() => toggleFAQ(index)}
            activeOpacity={0.8}
          >
            <View style={styles.questionRow}>
              <Text
                style={[
                  styles.question,
                  openIndex === index && { color: "#37043a" },
                ]}
              >
                {item.question}
              </Text>
              <AntDesign
                name="caretdown"
                size={20}
                color={openIndex === index ? "#37043a" : "#6a5c7b"}
                style={{
                  transform: [
                    { rotate: openIndex === index ? "180deg" : "0deg" },
                  ],
                }}
              />
            </View>
            {openIndex === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact Support Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactText}>
            Can't find the answer you're looking for?{"\n"}
            Feel free to reach out to our support team.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => alert("Opening support chat...")}
          >
            <LinearGradient
              colors={["#b57edcff", "#750d83ff", "#750d83ff"]}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 80 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#750d83ff",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#f8f4fc",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#750d83ff",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardOpen: {
    backgroundColor: "#e5d3f5",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
    color: "#750d83ff",
  },
  answer: {
    marginTop: 10,
    color: "#750d83ff",
    fontSize: 15,
    lineHeight: 22,
    borderTopWidth: 1,
    borderTopColor: "#c9b7e2",
    paddingTop: 10,
  },
  contactSection: {
    alignItems: "center",
    marginTop: 40,
  },
  contactText: {
    color: "#750d83ff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  contactButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#750d83ff",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
   marginTop: 20,
},

});
