// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { zoneService } from "../../admin/common/makeServices";
import { weredaService } from "../../admin/common/makeServices";
import { Form } from "antd";

export const cityFields = [
  {
    name: "weredaId",
    label: "Wereda",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Wereda",
    },
    rules: [{ required: true }],
  },
  {
    name: "cityName",
    label: "City Name",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },
];

export default function CityForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [wereda, setWereda] = useState([]);
  useEffect(() => {
    async function loadWereda() {
      const res = await weredaService.list();
      setWereda(
        res.data.map((wrd) => ({
          label: `${wrd.weredaName}`,
          value: wrd._id,
        }))
      );
    }

    loadWereda();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={cityFields.map((f) => {
        if (f.name === "weredaId") {
          return { ...f, props: { ...f.props, options: wereda } };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
