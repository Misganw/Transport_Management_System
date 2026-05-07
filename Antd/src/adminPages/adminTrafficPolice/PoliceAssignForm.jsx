// src/modules/employees/employeesForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { Form, Image, Upload } from "antd";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PoliceAssignmentServices,
  routService,
  subRoutServices,
} from "../../admin/common/makeServices";
import axios from "axios";
import { on } from "events";
import dayjs from "dayjs";

// ......... End of Import .....

export default function PoliceAssignForm({ initialValues = {}, onCancel }) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [tpolice, setTpolice] = useState([]);
  const [subRout, setSubRout] = useState([]);

  const isEditMode = Boolean(initialValues?._id);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      const payload = {
        ...values,
        assignmentDate: values.assignmentDate
          ? values.assignmentDate.format("YYYY-MM-DD")
          : null,
      };

      if (isEditMode) {
        await PoliceAssignmentServices.update(initialValues._id, payload);
        toast.success("Traffic Police updated successfully");
      } else {
        await PoliceAssignmentServices.create(payload);

        toast.success("Traffic Police assigned successfully");
      }

      form.resetFields();
      onCancel?.();

      queryClient.invalidateQueries(["policeAssignment"]); // refresh the traffic assinment list
    } catch (error) {
      toast.error(
        isEditMode
          ? "Error updating traffic police assignemnt"
          : "Error creating traffic police assignemnt",
      );
    }
  };

  // Preload Routes
  useEffect(() => {
    const fetchRout = async () => {
      try {
        const res = await axios.get(backendURL + "/tpassignment/subroutes");
        setSubRout(
          res.data.map((r) => ({
            label: `${r.routId.departure}-${r.routId.arrival} | ${r.subdeparture} - ${r.subarrival}`,
            value: r._id,
          })),
        );
      } catch (err) {
        toast.error("Error loading SubRouts:", err);
      }
    };
    fetchRout();
  }, []);

  // Preload Traffic Police
  useEffect(() => {
    const fetchTrafficPolice = async () => {
      try {
        const res = await axios.get(backendURL + "/tpassignment/officers");
        setTpolice(
          res.data.map((tp) => ({
            label: `${tp.fName} ${tp.mName} ${tp.lName}`,
            value: tp._id,
          })),
        );
      } catch (err) {
        toast.error("Error loading Traffic Police:", err);
      }
    };
    fetchTrafficPolice();
  }, []);

  useEffect(() => {
    if (!initialValues) return;

    const values = { ...initialValues };

    if (values.assignmentDate) {
      values.assignmentDate = dayjs(values.assignmentDate);
    }

    form.setFieldsValue(values);
  }, [initialValues, form]);

  const policeFields = [
    {
      name: "subrouteId",
      label: "Route",
      type: "select",
      colSpan: 12,
      props: { options: subRout, placeholder: "Select SubRoute" },
      rules: [{ required: true }],
    },
    {
      name: "trafficOfficerId",
      label: "Traffic Officer",
      type: "select",
      colSpan: 12,
      props: {
        options: tpolice,
        placeholder: "Select Traffic Officer",
      },
      rules: [{ required: false }],
    },
    {
      name: "detail",
      label: "Detail",
      type: "textarea",
      colSpan: 12,
      props: { placeholder: "Enter Detail" },
      rules: [{ required: false }],
    },
    {
      name: "assignmentDate",
      label: "Assignment Date",
      type: "date",
      colSpan: 12,
      props: { placeholder: "Select Assignment Date" },
      rules: [{ required: false }],
    },
  ];
  const dynamicFields = policeFields.map((field) => {
    switch (field.name) {
      case "subrouteId":
        return {
          ...field,
          props: {
            ...field.props,
            options: subRout,
          },
        };

      case "trafficOfficerId":
        return {
          ...field,
          props: {
            ...field.props,
            options: tpolice,
            disabled: !tpolice.length,
          },
        };

      default:
        return field;
    }
  });
  const normalizedInitialValues = React.useMemo(() => {
    if (!initialValues) return {};

    const values = { ...initialValues };
    if (values.assignmentDate) {
      values.assignmentDate = dayjs(values.assignmentDate);
    }

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
