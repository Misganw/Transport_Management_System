// src/modules/Cars/CarsForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "./common/DynamicForm";
import { employeeByCompany } from "./common/makeServices";
import { Form } from "antd";

export const userFields = [
  {
    name: "user_Id",
    label: "Employee Name",
    type: "select",
    colSpan: 12,
    props: {
      options: [], // dynamic
      placeholder: "Select Employee Name",
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
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Officer", value: "officer" },
        { label: "Coordinator", value: "coordinator" },
        { label: "Passenger", value: "passenger" },
      ],
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

export default function UserForm({ initialValues = {}, onFinish, onCancel }) {
  const [form] = Form.useForm();
  const [employee, setEmployee] = useState([]);
  // const [email, setEmail] = useState("");
  const [selectedEmployee, setSelectedCompany] = useState(null);

  useEffect(() => {
    async function loadEmployee() {
      const res = await employeeByCompany.getEmployeesByCompany();
      setEmployee(
        res.data.map((emp) => ({
          label: `${emp.name}`,
          value: emp._id,
          email: emp.email, // include email for auto-fill
        })),
      );
    }

    loadEmployee();
  }, []);

  // This is your handleChange equivalent
  const handleChange = (employeeId) => {
    // console.log("Selected Employee ID:", employeeId);
    setSelectedCompany(employeeId);

    // You can do more here, like auto-filling other fields based on employee
    const emp = employee.find((e) => e.value === employeeId);
    if (emp) {
      form.setFieldsValue({ email: emp.email }); // example if you want to auto-fill email
    }
  };

  return (
    <DynamicForm
      form={form}
      fields={userFields.map((f) => {
        if (f.name === "user_Id") {
          return {
            ...f,
            props: {
              ...f.props,
              options: employee,
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
