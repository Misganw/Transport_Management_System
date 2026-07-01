import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { socket } from "../../admin/common/socket.js";
import "leaflet/dist/leaflet.css";
import { Typography } from "antd";

const { Text, Title } = Typography;

// automatically move map when GPS changes
function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 17);
  }, [center]);

  return null;
}

export default function LiveTrackingPageLeaflet() {
  const { report_Id } = useParams();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [location, setLocation] = useState(null);
  const [RID, setRID] = useState(null);

  useEffect(() => {
    // console.log("LiveTrackingPage loaded");
    // console.log("REPORT ID:", report_Id);
    // console.log("GPS UPDATE:", Date.now());

    socket.emit("joinReportRoom", report_Id);
    // console.log("JOIN ROOM:", report_Id);

    const fetchTracking = async () => {
      // console.log("fetchTracking started");
      try {
        console.log("Sending request...");
        const res = await axios.get(`${backendURL}/tracking/${report_Id}`);
        // console.log("Request completed");

        // console.log("INITIAL TRACKING:", res.data);
        setRID(res.data.report_Id);
        // setLocation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTracking();

    socket.on("vehicleLocation", (data) => {
      // console.log("LIVE UPDATE:", data);
      setLocation(data);
    });

    socket.on("trackingStopped", () => {
      alert("Tracking stopped by traffic police");
      setLocation(null);
    });

    return () => {
      socket.emit("leaveReportRoom", report_Id);
      socket.off("vehicleLocation");
    };
  }, [report_Id]);

  if (!location) {
    return <h2>Waiting for GPS location...</h2>;
  }

  const position = [location.latitude, location.longitude];
  console.log("GPS data (Latitude)", location.latitude);
  // console.log("Report ID", RID);
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <MapContainer
        center={position}
        zoom={17}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          // url="
          // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          // "
          ttribution="&copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        <ChangeView center={position} />

        <Marker position={position}>
          <Popup>
            <bold>Live Vehicle Location</bold>
            <hr style={{ marginTop: "0px", paddingTop: "0px" }} />
            {/* Lat:
            {location.latitude}
            <br />
            Lng:
            {location.longitude}
            <br /> */}
            <Text style={{ color: "brown", size: "small" }}>Driver:</Text>{" "}
            {RID.ticketId?.programId?.driverId?.fName}{" "}
            {RID.ticketId?.programId?.driverId?.mName} -{" "}
            {RID.ticketId?.programId?.driverId?.phone}
            <br />
            <Text style={{ color: "green", size: "small" }}>Car:</Text>{" "}
            {RID.ticketId?.programId?.carId?.type}{" "}
            {RID.ticketId?.programId?.carId?.level} -{" "}
            {RID.ticketId?.programId?.carId?.plateNumber}
            <br />
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
