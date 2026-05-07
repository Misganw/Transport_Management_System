// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { Form } from "antd";

export const zoneFields = [
  {
    name: "stateId",
    label: "State",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select State",
    },
    rules: [{ required: true }],
  },
  {
    name: "zoneName",
    label: "Zone Name",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
];

export default function ZoneForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [state, setState] = useState([]);
  useEffect(() => {
    async function loadState() {
      const res = await stateService.list();
      setState(
        res.data.map((st) => ({
          label: `${st.stateName}`,
          value: st._id,
        }))
      );
    }

    loadState();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={zoneFields.map((f) => {
        if (f.name === "stateId") {
          return { ...f, props: { ...f.props, options: state } };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
