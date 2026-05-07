// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
// import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";
import dayjs from "dayjs";
import {
  routService,
  carServices,
  programServices,
} from "../../admin/common/makeServices";

export default function ProgramForm({
  initialValues = {},
  onFinish,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [rout, setRout] = useState([]);
  const [car, setCar] = useState([]);
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
  const programFields = [
    {
      name: "routId",
      label: "Route",
      type: "select",
      colSpan: 12,
      props: { options: rout, placeholder: "Select Route" },
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
        onChange: (carId) => {
          form.setFieldsValue({ seat: null });
          const selectedCar = car.find((c) => c.value === carId);
          if (selectedCar) {
            form.setFieldsValue({
              seat: selectedCar.seats, //auto-populate seat
            });
          }
        },
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
          { label: "Firtst round", value: "1rst" },
          { label: "Second round", value: "2nd" },
          { label: "Third Round", value: "3rd" },
          { label: "Fourth Round", value: "4rth" },
          { label: "Fivth Round", value: "5th" },
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
      rules: [{ required: true }],
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
    />
  );
}
