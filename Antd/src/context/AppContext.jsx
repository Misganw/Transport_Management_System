import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppContext = createContext();
export const AppContextProvider = (probs) => {
  axios.defaults.withCredentials = true;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState(false);
  // let bol = "";
  const getUserData = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(backendURL + "/getUserData");
      axios.defaults.withCredentials = true;
      if (data.success) {
        setUserData(data.userData);
        return data.userData; // return user for immediate use
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAuthStatus = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(backendURL + "/checkAuthenticaion");
      if (data.success) {
        setIsloggedIn(true);
        getUserData();
      }
    } catch (error) {
      // Axios error has response object
      if (error.response && error.response.status === 401) {
        // Not logged in, expected on initial load
        setIsloggedIn(false);
      } else {
        // Only toast real errors
        toast.error("Server error: " + error.message);
      }
    }
  };

  const [isLoggedIn, setIsloggedIn] = useState(false);

  // Persist login state to localStorage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/logout");
      data.success && setIsloggedIn(false);
      data.success && setUserData(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    backendURL,
    isLoggedIn,
    setIsloggedIn,
    userData,
    setUserData,
    getUserData,
    logout,
  };
  return (
    <AppContext.Provider value={value}>{probs.children}</AppContext.Provider>
  );
};
