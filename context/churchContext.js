import React, { createContext, useState, useContext, useEffect } from "react";
// Create the context
const ChurchContext = createContext();
import { useUser } from "./userContext";

// Create a provider component
export const ChurchProvider = ({ children }) => {
  const [churchName, setChurchName] = useState("");
  const { user, userInfo, isLoading } = useUser();
  
  useEffect(() => {
    
    if (!isLoading) {
        if(userInfo){
            if (userInfo?.Title?.Category == "KOUF") {
                setChurchName(userInfo.Title.ChurchKOUFLeader);
            }
        }
    }

  }, [isLoading]);

  return (
    <ChurchContext.Provider value={{ churchName, setChurchName }}>
      {children}
    </ChurchContext.Provider>
  );
};

// Custom hook to use the ChurchContext
export const useChurch = () => useContext(ChurchContext);
