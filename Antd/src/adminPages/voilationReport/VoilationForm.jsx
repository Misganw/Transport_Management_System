// src/modules/Violations/ViolationForm.jsx
import React, { useState, useEffect, useRef } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { Form } from "antd";
import {
  ticketService,
  ruleServices,
  voilationService,
} from "../../admin/common/makeServices";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { socket } from "../../admin/common/socket.js";

export default function ViolationForm({
  initialValues = {},
  onFinish,
  onCancel,
}) {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";
  const [form] = Form.useForm();

  const [tickets, setTickets] = useState([]);
  const [police, setPolice] = useState([]);
  const [rules, setRules] = useState([]);

  // Load Tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(backendURL + "/voilationReports");

        const options = res.data.map((t) => ({
          label: `${t.passengerName} | ${t.reservationCode} | ${t.programId?.routId?.departure} → ${t.programId?.routId?.arrival}`,
          value: t._id,
        }));

        setTickets(options);

        // editing mode
        if (initialValues.ticketId) {
          form.setFieldsValue({ ...initialValues });
          loadPolice(initialValues.ticketId);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load tickets");
        console.error("Error loading tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  // Load Rules
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await ruleServices.list();

        setRules(
          res.data.map((r) => ({
            label: r.title,
            value: r._id,
          })),
        );
      } catch (err) {
        console.error("Error loading rules:", err);
      }
    };

    fetchRules();
  }, []);

  // Load Police by Ticket
  const loadPolice = async (ticketId) => {
    try {
      const res = await axios.get(backendURL + `/voilationReports/${ticketId}`);

      setPolice(
        res.data.map((p) => ({
          label: `${p.trafficOfficerId?.fName} ${p.trafficOfficerId?.lName} | ${p.subrouteId?.subdeparture} <--> ${p.subrouteId?.subarrival}`,
          value: p._id,
        })),
      );
    } catch (err) {
      console.error("Error loading police:", err);
      toast.error(
        err.response?.data?.message || "Failed to load assigned police",
      );
    }
  };

  const violationFields = [
    {
      name: "ticketId",
      label: "Ticket",
      type: "select",
      colSpan: 12,
      props: {
        options: tickets,
        placeholder: "Select Ticket",
        onChange: (ticketId) => {
          form.setFieldsValue({ officerAssignmentId: null });
          loadPolice(ticketId);
        },
      },
      rules: [{ required: true }],
    },

    {
      name: "officerAssignmentId",
      label: "Assigned Traffic Police",
      type: "select",
      colSpan: 12,
      props: {
        options: police,
        placeholder: "Select Traffic Police",
      },
      rules: [{ required: true }],
      defaultValue: "No Traffic Police Assigned",
    },

    {
      name: "ruleID",
      label: "Rule Violated",
      type: "select",
      colSpan: 12,
      props: {
        options: rules,
        placeholder: "Select Rule",
      },
      rules: [{ required: true }],
    },

    {
      name: "CaseDescription",
      label: "Case Description",
      type: "textarea",
      colSpan: 24,
      props: {
        rows: 4,
        placeholder: "Describe the violation",
      },
      rules: [{ required: true }],
    },
  ];

  /* ... Get Current location of reporter to add in report table... */
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  };
  /* ... Get Current location of reporter ... */

  const handleSubmit = async (values) => {
    try {
      let location = null;

      try {
        location = await getCurrentLocation();
      } catch (err) {
        console.warn("Location unavailable:", err);
      }

      const payload = {
        ...values,
        location,
      };

      onFinish(payload);
    } catch (err) {
      console.error(err);
    }
  };

  const watchRef = useRef(null);

  return (
    <DynamicForm
      form={form}
      fields={violationFields}
      initialValues={initialValues}
      onFinish={handleSubmit}
      onCancel={onCancel}
    />
  );
}
