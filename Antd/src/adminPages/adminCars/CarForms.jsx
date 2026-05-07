// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";

export const carsFields = [
  {
    name: "ownerId",
    label: "Owner",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Owner",
    },
    rules: [{ required: true }],
  },
  {
    name: "type",
    label: "Type",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
  {
    name: "model",
    label: "Model",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
  { name: "plateNumber", label: "Plate Number", type: "text", colSpan: 12 },
  {
    name: "level",
    label: "Level",
    type: "select",
    colSpan: 12,
    props: {
      options: [
        { label: "1ኛ ደረጃ", value: "1ኛ ደረጃ" },
        { label: "2ኛ ደረጃ", value: "2ኛ ደረጃ" },
        { label: "3ኛ ደረጃ", value: "3ኛ ደረጃ" },
      ],
    },
  },
  { name: "NoofSeats", label: "Number of Seats", type: "number", colSpan: 12 },
  { name: "value", label: "Value", type: "number", colSpan: 12 },
  // {
  //   name: "profileImage",
  //   label: "Profile Image",
  //   type: "upload",
  //   colSpan: 24,
  //   props: {
  //     maxCount: 1,
  //     listType: "picture",
  //   },
  // },
];

export default function CarsForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [owners, setOwners] = useState([]);
  useEffect(() => {
    async function loadOwners() {
      const res = await ownerByCompany.listByCompany();
      setOwners(
        res.data.map((o) => ({
          label: `${o.fName} ${o.lName}`,
          value: o._id,
        }))
      );
    }

    loadOwners();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={carsFields.map((f) => {
        if (f.name === "ownerId") {
          return { ...f, props: { ...f.props, options: owners } };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
