// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "./common/DynamicForm";
import { trafficByCompany } from "./common/makeServices";
import { Form } from "antd";

export const userFields = [
  {
    name: "employeeId",
    label: "Traffic Police Name",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Traffic Police Name",
      // onChange: handleChange, // function called when value changes
      // allowClear: true, // allows clearing the selected value
    },
    rules: [{ required: true }],
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    colSpan: 12,
    rules: [{ required: true }],
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    colSpan: 12,
    rules: [{ required: true }],
  },

  {
    name: "roles",
    label: "Role",
    type: "select",
    colSpan: 12,
    rules: [{ required: true }],
    props: {
      placeholder: "Select Role",
      options: [{ label: "Officer", value: "officer" }],
    },
  },

  {
    name: "statuses",
    label: "Status",
    type: "select",
    colSpan: 12,
    rules: [{ required: true }],
    props: {
      placeholder: "Select Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  },
];

export default function TPUserForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [traffic, setTraffic] = useState([]);
  // const [email, setEmail] = useState("");
  const [selectedTraffic, setSelectedTraffic] = useState(null);

  useEffect(() => {
    async function loadTraffic() {
      const res = await trafficByCompany.getTrafficPoliceBycompany();
      setTraffic(
        res.data.map((emp) => ({
          label: `${emp.name}`,
          value: emp._id,
          email: emp.email, // include email for auto-fill
        })),
      );
    }

    loadTraffic();
  }, []);

  // This is your handleChange equivalent
  const handleChange = (trafficId) => {
    // console.log("Selected Traffic ID:", employeeId);
    setSelectedTraffic(trafficId);

    // You can do more here, like auto-filling other fields based on Traffic
    const traff = traffic.find((e) => e.value === trafficId);
    if (traff) {
      form.setFieldsValue({ email: traff.email }); // example if you want to auto-fill email
    }
  };

  return (
    <DynamicForm
      form={form}
      fields={userFields.map((f) => {
        if (f.name === "employeeId") {
          return {
            ...f,
            props: {
              ...f.props,
              options: traffic,
              onChange: handleChange, // add it here
              allowClear: true,
            },
          };
        }
        return f;
      })}
      initialValues={initialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
