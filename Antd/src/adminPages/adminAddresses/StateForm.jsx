// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { countryService } from "../../admin/common/makeServices";
import { Form } from "antd";

export const stateFields = [
  {
    name: "countryId",
    label: "Country",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Country",
    },
    rules: [{ required: true }],
  },
  {
    name: "stateName",
    label: "State Name",
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

export default function StatForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [country, setCountry] = useState([]);
  useEffect(() => {
    async function loadCountry() {
      const res = await countryService.list();
      setCountry(
        res.data.map((c) => ({
          label: `${c.cName}`,
          value: c._id,
        }))
      );
    }

    loadCountry();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={stateFields.map((f) => {
        if (f.name === "countryId") {
          return { ...f, props: { ...f.props, options: country } };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
