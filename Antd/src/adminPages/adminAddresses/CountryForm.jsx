// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
// import { ownerByCompany } from "../../admin/common/makeServices";
import { Form } from "antd";

export const countryFields = [
  {
    name: "cName",
    label: "Country Name",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
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

export default function CountriesForm({
  initialValues = {},
  onFinish,
  onCancel,
}) {
  const [form] = Form.useForm();
  // const [owners, setOwners] = useState([]);

  return (
    <DynamicForm
      form={form}
      fields={countryFields}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
