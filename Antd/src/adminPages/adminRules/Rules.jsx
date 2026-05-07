import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { Form } from "antd";
import dayjs from "dayjs";
export default function Rules({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [rout, setRout] = useState([]);
  const [car, setCar] = useState([]);
  //   useEffect(() => {
  //     const fetchRout = async () => {
  //       try {
  //         const res = await routService.list();
  //         setRout(
  //           res.data.map((rout) => ({
  //             label: `${rout.departure} -> ${rout.arrival}`,
  //             value: rout._id,
  //           }))
  //         );
  //         // If editing, populate the form AFTER options are ready
  //         if (initialValues.routId) {
  //           form.setFieldsValue({ ...initialValues });
  //         }
  //       } catch (err) {
  //         toast.error("Error loading routes:", err);
  //       }
  //     };
  //     fetchRout();
  //   }, []);

  //   useEffect(() => {
  //     const fetchCar = async () => {
  //       try {
  //         const res = await carServices.list();
  //         setCar(
  //           res.data.map((car) => ({
  //             label: `${car.type} | ${car.level} | ${car.NoofSeats} Seats`,
  //             value: car._id,
  //             seats: car.NoofSeats,
  //           }))
  //         );
  //       } catch (err) {
  //         toast.error("Error loading cars:", err);
  //       }
  //     };
  //     fetchCar();
  //   }, []);

  const ruleFields = [
    {
      name: "title",
      label: "Rule Type",
      type: "select",
      colSpan: 12,
      props: {
        options: [
          { label: "Speed Limit Compliance", value: "speed Limit" },
          { label: "Seatbelt Use & Passenger Safety", value: "seat belt" },
          { label: "Traffic Signal Obedience", value: "traffic Signal" },
          {
            label: "Distracted Driving Prevention",
            value: "distracted Driving",
          },
          { label: "Fatigue Management", value: "fatigue Management" },
          { label: "Vehicle Roadworthiness", value: "vehicle Roadworthiness" },
          { label: "Driver Behavior & Training", value: "driver Behavior" },
          { label: "Driving Under Influence", value: "drivingUnder Influence" },
          {
            label: "Mobile Phone Restrictions",
            value: "mobile Phone Restrictions",
          },
          {
            label: "Lane & Overtaking Compliance",
            value: "lane OvertakingCompliance",
          },
          {
            label: "Parking & Stopping Compliance",
            value: "parking Stopping Compliance",
          },
          {
            label: "Passenger Capacity Limits",
            value: "passenger Capacity Limits",
          },
        ],
        placeholder: "Select Rule Type",
      },
      rules: [{ required: true }],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      colSpan: 12,
      initialValues: "",
    },
  ];
  return (
    <DynamicForm
      form={form}
      fields={ruleFields}
      initialValues={{
        ...initialValues,
      }}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
