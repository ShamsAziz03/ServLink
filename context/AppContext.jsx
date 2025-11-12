import React, { createContext, useState } from "react";

export const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [userCurrentLocation, setUserCurrentLocation] = useState({});

  return (
    <AppContext.Provider
      value={{ userCurrentLocation, setUserCurrentLocation }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
