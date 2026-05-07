// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
// import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";

export const routFields = [
  {
    name: "departure",
    label: "Departure",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
  {
    name: "arrival",
    label: "Arrival",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
];

export default function RoutsForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();

  return (
    <DynamicForm
      form={form}
      fields={routFields}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
