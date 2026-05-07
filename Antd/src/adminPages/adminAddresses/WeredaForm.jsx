// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { zoneService } from "../../admin/common/makeServices";
import { Form } from "antd";

export const weredaFields = [
  {
    name: "zoneId",
    label: "Zone",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Zone",
    },
    rules: [{ required: true }],
  },
  {
    name: "weredaName",
    label: "Wereda Name",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
];

export default function WeredaForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [zone, setZone] = useState([]);
  useEffect(() => {
    async function loadZone() {
      const res = await zoneService.list();
      setZone(
        res.data.map((zn) => ({
          label: `${zn.zoneName}`,
          value: zn._id,
        }))
      );
    }

    loadZone();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={weredaFields.map((f) => {
        if (f.name === "zoneId") {
          return { ...f, props: { ...f.props, options: zone } };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
