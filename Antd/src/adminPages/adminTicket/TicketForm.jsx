// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
// import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";
import dayjs from "dayjs";
import {
  routService,
  carServices,
  cancelledTicketServices,
  ticketService,
  passengerServices,
} from "../../admin/common/makeServices";

export default function TicketForm({ initialValues = {}, onFinish, onCancel }) {
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

  const ticketFields = [
    {
      name: "passengerName",
      label: "Passenger Name",
      type: "text",
      colSpan: 12,
      props: { disabled: true },
      rules: [{ required: true }],
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      colSpan: 12,
      rules: [{ required: false }],
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      colSpan: 12,
      rules: [{ required: false }],
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      colSpan: 12,
      initialValues: "",
      props: {
        options: [
          { label: "Pending", value: "pending" },
          { label: "Paid", value: "paid" },
        ],
        placeholder: "Select Status",
      },
      rules: [{ required: true }],
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      colSpan: 12,
      initialValues: "",
      props: {
        options: [
          { label: "Cash", value: "cash" },
          { label: "Stripe", value: "stripe" },
          { label: "TeleBirr", value: "telebirr" },
          { label: "Mobile Banking", value: "mobileBanking" },
          { label: "Chapa", value: "chapa" },
          { label: "ArifPay", value: "arifpay" },
          { label: "Bank Transfer", value: "bankTransfer" },
          { label: "Pay Pal", value: "paypal" },
          { label: "ZELLE", value: "zelle" },
        ],
        placeholder: "Select Status",
      },
      rules: [{ required: true }],
    },
  ];
  return (
    <DynamicForm
      form={form}
      fields={ticketFields}
      initialValues={{
        ...initialValues,
      }}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
