// src/modules/employees/employeesForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { Form, Image, Upload, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subRoutServices } from "../../admin/common/makeServices.js";
import axios from "axios";

// ......... End of Import .....

export default function SubroutForm({ initialValues = {}, onCancel }) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [rout, setRout] = useState([]);
  const [getBySubrout, setGetBySubrout] = useState([]);

  const isEditMode = Boolean(initialValues?._id);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const onFinish = async (values) => {
    try {
      // const formData = new FormData();

      if (isEditMode) {
        await subRoutServices.update(initialValues._id, values);
        toast.success("Subrout updated successfully");
      } else {
        await subRoutServices.create(values);

        toast.success("Subrout created successfully");
      }

      form.resetFields();
      onCancel?.();

      queryClient.invalidateQueries(["subrouts"]); // refresh the subrout list
    } catch (error) {
      toast.error(
        isEditMode ? "Error updating subrout" : "Error creating subrout",
      );
    }
  };

  // Preload Routs
  useEffect(() => {
    const fetchRout = async () => {
      try {
        const res = await axios.get(backendURL + "/routsForSubrout");
        setRout(
          res.data.map((c) => ({
            label: `${c.departure} - ${c.arrival}`,
            value: c._id,
          })),
        );
      } catch (err) {
        console.log(err);
        toast.error("Error loading Routs:", err);
      }
    };
    fetchRout();
  }, []);
  //  ..... to get rout by subrout....
  useEffect(() => {
    if (!isEditMode) return;
    const getRoutBySubrout = async () => {
      try {
        const res = await axios.get(
          backendURL + `/routsForSubrout/${initialValues._id}`,
        );
        const formatted = res.data.map((r) => ({
          label: `${r.departure} - ${r.arrival}`,
          value: r._id,
        }));
        setRout(formatted);
      } catch (err) {
        console.log(err);
        toast.error("Error loading Rout:", err);
      }
    };
    getRoutBySubrout();
  }, [isEditMode, initialValues]);

  const subRoutFields = [
    {
      name: "routId",
      label: "Rout",
      type: "select",
      colSpan: 12,
      props: { options: rout, placeholder: "Select Rout" },
      rules: [{ required: true }],
    },
    {
      name: "subdeparture",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Sub Departure</span>

          <Tooltip title="Sub departure between main departure and arrival. E.g. if main route is A - B, sub departure can be X,Y,Z, where X,Y,Z are between A and B.">
            <InfoCircleOutlined
              style={{ color: "#1890ff", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      ),
      type: "text",
      colSpan: 12,
      rules: [{ required: true }],
    },
    {
      name: "subarrival",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Sub Arrival</span>

          <Tooltip title="Sub arrival between main departure and arrival. E.g. if main route is A - B, sub arrival can be X,Y,Z, where X,Y,Z are between A and B.">
            <InfoCircleOutlined
              style={{ color: "#1890ff", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      ),
      type: "text",
      colSpan: 12,
      rules: [{ required: false }],
    },
  ];
  const dynamicFields = subRoutFields.map((field) => {
    switch (field.name) {
      case "routId":
        return {
          ...field,
          props: {
            ...field.props,
            options: rout,
          },
        };
      default:
        return field;
    }
  });
  const normalizedInitialValues = React.useMemo(() => {
    if (!initialValues) return {};
    const values = { ...initialValues };
    return values;
  }, [initialValues]);
  return (
    <DynamicForm
      form={form}
      fields={dynamicFields}
      initialValues={normalizedInitialValues}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
}
