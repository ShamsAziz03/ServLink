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
import { useNavigation } from "@react-navigation/native";

const Questions = () => {
  const width = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userCurrentLocation, currentService, setQuestionsAnswers } =
    useContext(AppContext); //to use golbal var

  const [serviceQuestions, setServiceQuestions] = useState([
    {
      question_id: 4,
      question_text: "Is the furniture new (from a box) or used?",
      answer_type: "select",
      options: JSON.stringify([
        "New (from package)",
        "Used (already assembled before)",
      ]),
      service_id: "5",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentQuestion = serviceQuestions[currentIndex];
  const [otherAnswers, setOtherAnswers] = useState(true);
  const [selectedOption, setSelectedOption] = useState({});

  const fetchServiceQuestions = async () => {
    try {
      const response = await fetch(
        `http://ip:5000/serviceQuestions/getServiceQuestions/${currentService.service_id}`
      );
      const fetchedData = await response.json();
      setServiceQuestions(fetchedData);
      console.log("questions:", fetchedData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };


  const handleNext = () => {
    const q = currentQuestion;

    if (q.is_required && !answers[q.question_text]) {
      alert("This question is required.");
      return;
    }
    if (currentIndex < serviceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuestionsAnswers(answers);
      navigation.navigate("serviceBooking");
    }
    setOtherAnswers(false);
  };

  useEffect(() => {
    fetchServiceQuestions();
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption({});
    setOtherAnswers(false);
  }, [currentService.service_id]);

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
        <HeaderLogoReturn
          linkToReturn="servicePage"
          title="Questions"
          goToService={true}
        />
        {/* current location */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#5f0557ff",
              marginBottom: 20,
              padding: 10,
              backgroundColor: "#eed4edff",
              borderRadius: 15,
            }}
          >
            {userCurrentLocation.display_name
              ? "Location -> " + userCurrentLocation.display_name
              : "Choose Location! Press Back"}
          </Text>
        </View>
        {/* Progress */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {serviceQuestions.map((_, i) => (
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
              value={answers[currentQuestion.question_text] || ""}
              onChangeText={(text) =>
                setAnswers({ ...answers, [currentQuestion.question_text]: text })
              }
            />
          )}

          {/* Select input */}
          {currentQuestion.answer_type === "select" &&
            JSON.parse(currentQuestion.options).map((opt, i) => (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => {
                    if (opt === "Other") setOtherAnswers(true);
                    else setOtherAnswers(false);
                    setAnswers({
                      ...answers,
                      [currentQuestion.question_text]: opt,
                    });
                    setSelectedOption({
                      ...selectedOption,
                      [currentQuestion.question_text]: opt,
                    });
                  }}
                  style={{
                    width: width * 0.85,
                    padding: 15,
                    backgroundColor:
                      selectedOption[currentQuestion.question_text] === opt
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
                        selectedOption[currentQuestion.question_text] === opt
                          ? "#fff"
                          : "#5f0557ff",
                      fontWeight: "700",
                      fontSize: 18,
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
                {/* for others */}
                {opt === "Other" && otherAnswers === true && (
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
                      marginTop: 10,
                    }}
                    placeholder="Please specify your answer"
                    value={
                      answers[currentQuestion.question_text] === "Other"
                        ? ""
                        : currentQuestion.question_text
                    }
                    onChangeText={(text) =>
                      setAnswers({
                        ...answers,
                        [currentQuestion.question_text]: text,
                      })
                    }
                  />
                )}
              </View>
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
          {/* back button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#e5d6eaff",
              borderRadius: 12,
              padding: 10,
              width: 100,
              alignItems: "center",
            }}
            onPress={() => {
              currentIndex > 0
                ? setCurrentIndex(currentIndex - 1)
                : navigation.navigate("userLocation");
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Back</Text>
          </TouchableOpacity>

          {/* next button */}
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
