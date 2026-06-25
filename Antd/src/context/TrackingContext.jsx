import React, { createContext, useContext, useRef, useEffect } from "react";
import axios from "axios";

const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const watchIdRef = useRef(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const startTracking = (report_Id) => {
    const reportId = localStorage.setItem("activeTrackingReport", report_Id);
    console.log("GLOBAL TRACKING STARTED:", report_Id);

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          // console.log("GPS UPDATE:", latitude, longitude);
          // console.log("URL:", `${backendURL}/tracking/${report_Id}`);

          await axios.put(`${backendURL}/tracking/${report_Id}`, {
            latitude,
            longitude,
            accuracy,
            report_Id,
          });

          console.log("TRACKING SAVED:", report_Id);
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.log("GPS ERROR:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    );
  };

  const stopTracking = () => {
    localStorage.removeItem("activeTrackingReport", report_Id);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;

      console.log("TRACKING STOPPED");
    }
  };

  useEffect(() => {
    const reportId = localStorage.getItem("activeTrackingReport");

    if (reportId) {
      startTracking(reportId);
    }
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => useContext(TrackingContext);
