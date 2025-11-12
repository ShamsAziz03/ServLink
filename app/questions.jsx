import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderLogoReturn from "../components/headerLogoReturn";
import { Link } from "expo-router";
import { AppContext } from "../context/AppContext"; //for global states

const Questions = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();

  const questions = [
    // Furniture Assembly
    {
      question_id: 1,
      question_text: "What type of furniture needs assembly?",
      answer_type: "select",
      options: JSON.stringify([
        "Bed",
        "Wardrobe",
        "Table",
        "Chair",
        "Desk",
        "Other",
      ]),
    },
    {
      question_id: 2,
      question_text: "How many items need assembly?",
      answer_type: "select",
      options: JSON.stringify(["1", "2-3", "4-5", "6+"]),
    },
    {
      question_id: 3,
      question_text: "Do you already have all the parts and screws?",
      answer_type: "select",
      options: JSON.stringify(["Yes", "No, need help with missing parts"]),
    },
    {
      question_id: 4,
      question_text: "Is the furniture new (from a box) or used?",
      answer_type: "select",
      options: JSON.stringify([
        "New (from package)",
        "Used (already assembled before)",
      ]),
    },
    {
      question_id: 5,
      question_text: "Upload photo(s) of the furniture or manual (optional)",
      answer_type: "file",
    },
    {
      question_id: 6,
      question_text: "Any specific brand or model?",
      answer_type: "text",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("Answers:", answers);
    }
  };

  //to use golbal var
  const { userCurrentLocation, setUserCurrentLocation } =
    useContext(AppContext);

  useEffect(() => {
    console.log(
      "the global var is:",
      JSON.stringify(userCurrentLocation, null, 2)
    );
  }, []);

  return (
    <LinearGradient
      colors={["#fcf4fcff", "#d7afdcff"]}
      style={{ flex: 1, justifyContent: "space-between", padding: 20 }}
    >
      <View
        style={[
          styles.fullView,
          {
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <HeaderLogoReturn linkToRetrun="home" title="Questions" />
        {/* Progress */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {questions.map((_, i) => (
            <View
              key={i}
              style={{
                width: 20,
                height: 10,
                backgroundColor: i <= currentIndex ? "#7b117fff" : "#e6cce8",
                borderRadius: 4,
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>

        {/* Question */}
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              color: "#5f0557ff",
              marginBottom: 20,
            }}
          >
            {currentQuestion.question_text}
          </Text>

          {/* Text input */}
          {currentQuestion.answer_type === "text" && (
            <TextInput
              style={{
                backgroundColor: "#f5e7f3ff",
                borderRadius: 10,
                width: width * 0.9,
                padding: 15,
                fontSize: 19,
                marginBottom: 30,
                borderColor: "#684e6dff",
                borderWidth: 0.5,
              }}
              placeholder="Write Your answer here..."
              value={answers[currentQuestion.question_id] || ""}
              onChangeText={(text) =>
                setAnswers({ ...answers, [currentQuestion.question_id]: text })
              }
            />
          )}

          {/* Select input */}
          {currentQuestion.answer_type === "select" &&
            JSON.parse(currentQuestion.options).map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  setAnswers({ ...answers, [currentQuestion.question_id]: opt })
                }
                style={{
                  width: width * 0.85,
                  padding: 15,
                  backgroundColor:
                    answers[currentQuestion.question_id] === opt
                      ? "#7b117fff"
                      : "#fff",
                  borderRadius: 12,
                  marginVertical: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color:
                      answers[currentQuestion.question_id] === opt
                        ? "#fff"
                        : "#5f0557ff",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Navigation */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {currentIndex > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: "#e5d6eaff",
                borderRadius: 12,
                padding: 10,
                width: 100,
                alignItems: "center",
              }}
              onPress={() => setCurrentIndex(currentIndex - 1)}
            >
              <Text style={{ fontSize: 17, fontWeight: "500" }}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "#7b117fff",
              borderRadius: 12,
              padding: 10,
              width: 100,
              alignItems: "center",
            }}
            onPress={handleNext}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "500" }}>
              Next
            </Text>
          </TouchableOpacity>

          <Link href="/userLocation">
            <Text
              style={{
                color: "#e4e0e6ff",
                fontSize: 20,
                fontFamily: "Inter-Black",
              }}
            >
              go to map
            </Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Questions;

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
  },
  text: {
    color: "#7b3685ff",
    fontSize: 22,
    fontWeight: "900",
    paddingLeft: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#7b117fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
