import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderLogoReturn from "../components/headerLogoReturn";

const Questions = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();

  const questions = [
    {
      question_id: 1,
      question_text: "ما هو اسمك؟",
      answer_type: "text",
    },
    {
      question_id: 2,
      question_text: "ما هو لونك المفضل؟",
      answer_type: "select",
      options: JSON.stringify(["أحمر", "أزرق", "أخضر", "أصفر"]),
    },
    {
      question_id: 3,
      question_text: "اكتب وصفًا لنفسك",
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
          }}
        >
          {questions.map((_, i) => (
            <View
              key={i}
              style={{
                width: 40,
                height: 10,
                backgroundColor: i <= currentIndex ? "#7b117fff" : "#e6cce8",
                borderRadius: 4,
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>

        {/* Question */}
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
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
                backgroundColor: "#fff",
                borderRadius: 10,
                width: width * 0.9,
                padding: 15,
                fontSize: 16,
                marginBottom: 30,
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
                backgroundColor: "#ccc",
                borderRadius: 12,
                padding: 10,
                width: 100,
                alignItems: "center",
              }}
              onPress={() => setCurrentIndex(currentIndex - 1)}
            >
              <Text>Back</Text>
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
            <Text style={{ color: "#fff" }}>Next</Text>
          </TouchableOpacity>
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
