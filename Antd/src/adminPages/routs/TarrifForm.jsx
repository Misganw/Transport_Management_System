// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { countryService } from "../../admin/common/makeServices";
import { routService } from "../../admin/common/makeServices";
import { carServices } from "../../admin/common/makeServices";
import { Form } from "antd";

export const tarrifFields = [
  {
    name: "routId",
    label: "Rout",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Rout",
    },
    rules: [{ required: true }],
  },
  {
    name: "carId",
    label: "Car Type",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Cars",
    },
    rules: [{ required: true }],
  },
  {
    name: "amount",
    label: "price in Birr",
    type: "number",
    colSpan: 12,
    rules: [{ required: true }],
  },
];

export default function TarrifForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [rout, setRout] = useState([]);
  const [carType, setCarType] = useState([]);
  //   const [carLevel, setCarLevel] = useState([]);
  useEffect(() => {
    async function loadRout() {
      const rout = await routService.list();
      const car = await carServices.list();
      setRout(
        rout.data.map((rt) => ({
          label: `${rt.departure} -> ${rt.arrival}`,
          value: rt._id,
        }))
      );
      setCarType(
        car.data.map((ct) => ({
          label: `${ct.type} | ${ct.level}`,
          value: ct._id,
        }))
      );
      //   setCarLevel(
      //     car.data.map((cl) => ({
      //       label: `${cl.level}`,
      //       value: cl._id,
      //     }))
      //   );
    }

    loadRout();
  }, []);
  return (
    <DynamicForm
      form={form}
      fields={tarrifFields.map((f) => {
        if (f.name === "routId") {
          return { ...f, props: { ...f.props, options: rout } };
        }
        if (f.name === "carId") {
          return { ...f, props: { ...f.props, options: carType } };
        }
        // if (f.name === "carLevelId") {
        //   return { ...f, props: { ...f.props, options: carLevel } };
        // }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
