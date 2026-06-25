import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../admin/common/socket.js";
import { useParams } from "react-router-dom";

export default function LiveTrackingPage() {
  // console.log("LiveTrackingPage loaded");
  const { report_Id } = useParams();
  // console.log("REPORT ID:", report_Id);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [location, setLocation] = useState(null);

  useEffect(() => {
    socket.emit("joinReportRoom", report_Id);

    axios.get(`${backendURL}/tracking/${report_Id}`).then((res) => {
      console.log("Initial Tracking:", res.data);
      setLocation(res.data);
    });

    socket.on("vehicleLocation", (data) => {
      console.log("LIVE UPDATE RECEIVED:", data);
      setLocation(data);
    });
    socket.on("trackingStopped", () => {
      alert("Tracking stopped");
    });
    return () => {
      socket.emit("leaveReportRoom", report_Id);

      socket.off("vehicleLocation");

      socket.off("trackingStopped");
    };
  }, [report_Id]);

  useEffect(() => {
    if (!location) return;

    const url =
      `https://www.google.com/maps?q=` +
      `${location.latitude},${location.longitude}`;

    window.open(url, "_blank");
  }, [location]);

  return <div>Tracking vehicle...</div>;
}
