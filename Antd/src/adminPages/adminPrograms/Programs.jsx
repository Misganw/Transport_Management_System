// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
// import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import {
  routService,
  carServices,
  programServices,
  driverServices,
} from "../../admin/common/makeServices";

export default function ProgramForm({
  initialValues = {},
  onFinish,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [rout, setRout] = useState([]);
  const [car, setCar] = useState([]);
  const [driver, setDriver] = useState([]);
  const [tariffMsg, setTariffMsg] = useState("");
  const baseURL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchRout = async () => {
      try {
        const res = await routService.list();
        setRout(
          res.data.map((rout) => ({
            label: `${rout.departure} -> ${rout.arrival}`,
            value: rout._id,
          })),
        );
        // If editing, populate the form AFTER options are ready
        if (initialValues.routId) {
          form.setFieldsValue({ ...initialValues });
        }
      } catch (err) {
        toast.error("Error loading routes:", err);
      }
    };
    fetchRout();
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carServices.list();
        setCar(
          res.data.map((car) => ({
            label: `${car.type} | ${car.level} | ${car.NoofSeats} Seats`,
            value: car._id,
            seats: car.NoofSeats,
          })),
        );
      } catch (err) {
        toast.error("Error loading cars:", err);
      }
    };
    fetchCar();
  }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await driverServices.list();
        setDriver(
          res.data.map((driver) => ({
            label: `${driver.fName} ${driver.mName} ${driver.lName}`,
            value: driver._id,
          })),
        );
      } catch (err) {
        toast.error("Error loading drivers:", err);
      }
    };
    fetchDriver();
  }, []);

  const fetchTariff = async (routId, carId) => {
    // console.log("Route:", routId);
    // console.log("Car:", carId);
    if (!routId || !carId) return;

    try {
      const res = await axios.get(`${baseURL}/getTarrifByRouteAndCar`, {
        params: {
          routId,
          carId,
        },
      });

      if (res.data) {
        form.setFieldsValue({
          tarrif: res.data.amount, // replace with actual field name
        });
        setTariffMsg("");
      } else {
        form.setFieldsValue({
          tarrif: 100000000000000,
        });
        setTariffMsg("Tarrif not found. Enter manually.");
      }
    } catch (err) {
      console.error("Error loading tariff:", err);

      form.setFieldsValue({
        tarrif: null,
      });
    }
  };

  const programFields = [
    {
      name: "routId",
      label: "Route",
      type: "select",
      colSpan: 12,
      props: {
        options: rout,
        placeholder: "Select Route",
        onChange: (routId) => {
          const carId = form.getFieldValue("carId");

          fetchTariff(routId, carId);
        },
      },
      rules: [{ required: true }],
    },
    {
      name: "carId",
      label: "Cars",
      type: "select",
      colSpan: 12,
      props: {
        options: car,
        placeholder: "Select Car",
        showSearch: true,
        optionFilterProp: "label",
        onChange: (carId) => {
          form.setFieldsValue({ seat: null });
          const selectedCar = car.find((c) => c.value === carId);
          if (selectedCar) {
            form.setFieldsValue({
              seat: selectedCar.seats, //auto-populate seat
            });
          }

          const routId = form.getFieldValue("routId");

          fetchTariff(routId, carId);
        },
      },
      rules: [{ required: true }],
    },

    {
      name: "driverId",
      label: "Drivers",
      type: "select",
      colSpan: 12,
      props: {
        options: driver,
        placeholder: "Select Driver",
        showSearch: true,
        optionFilterProp: "label",
      },
      rules: [{ required: true }],
    },
    {
      name: "queue",
      label: "Queue Number",
      type: "select",
      colSpan: 12,
      initialValues: "Not assigned",
      props: {
        options: [
          { label: "First round", value: "1rst" },
          { label: "Second round", value: "2nd" },
          { label: "Third Round", value: "3rd" },
          { label: "Fourth Round", value: "4rth" },
          { label: "Fifth Round", value: "5th" },
          { label: "Sixth round", value: "6th" },
          { label: "Seventh round", value: "7th" },
          { label: "Eighth round", value: "8th" },
          { label: "Ninth Round", value: "9th" },
          { label: "Tenth Round", value: "10th" },
        ],
        placeholder: "Select Queue Number",
      },
      rules: [{ required: true }],
    },
    {
      name: "seat",
      label: "Total Seat",
      type: "number",
      colSpan: 12,
      props: { disabled: true },
      rules: [{ required: true }],
    },
    {
      name: "tarrif",
      label: "Tariff",
      type: "number",
      colSpan: 12,
      props: { disabled: false },
      rules: [{ required: true }],
      help: tariffMsg, // IMPORTANT
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      colSpan: 12,
      rules: [{ required: true }],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      colSpan: 12,
      initialValues: "scheduled",
      props: {
        options: [
          { label: "Scheduled", value: "scheduled" },
          { label: "Out", value: "out" },
          { label: "Come Inside", value: "inside" },
          { label: "Active", value: "active" },
          { label: "Canceled", value: "canceled" },
          { label: "Full", value: "full" },
        ],
        placeholder: "Select Status",
      },
      rules: [{ required: true }],
    },
  ];
  return (
    <DynamicForm
      form={form}
      fields={programFields}
      initialValues={{
        ...initialValues,
        date: initialValues.date ? dayjs(initialValues.date) : null,
      }}
      onFinish={onFinish}
      onCancel={onCancel}
      tariffMsg={tariffMsg} // add this
    />
  );
}
