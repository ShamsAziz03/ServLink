import React, { createContext, useState } from "react";

export const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [userCurrentLocation, setUserCurrentLocation] = useState({});
  const [currentService, setCurrentService] = useState({
    service_id: "1",
    category_id: "1",
    title: "Assemble furniture",
    image: "http://10.0.2.2:5000/assets/Assemble_and_install_furniture2.jpg",
    description:
      "Professional help assembling and installing furniture at your home.",
  });
  const [loggedUser, setLoggedUser] = useState({});
  const [questionsAnswers, setQuestionsAnswers] = useState({});
  const [choosedDate, setChoosedDate] = useState("");
  const [selected_from_searchPage, setSelected_from_searchPage] = useState(null);

  return (
    <AppContext.Provider
      value={{
        userCurrentLocation,
        setUserCurrentLocation,
        currentService,
        setCurrentService,
        loggedUser,
        setLoggedUser,
        questionsAnswers,
        setQuestionsAnswers,
        choosedDate,
        setChoosedDate,
        selected_from_searchPage,
        setSelected_from_searchPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
