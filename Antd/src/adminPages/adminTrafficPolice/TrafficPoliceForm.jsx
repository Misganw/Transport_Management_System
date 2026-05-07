// src/modules/employees/employeesForm.jsx
import React, { useState, useEffect } from "react";
import DynamicForm from "../../admin/common/DynamicForm";
import { Form, Image, Upload } from "antd";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  trafficPoliceServices,
  countryService,
  stateService,
  zoneService,
  weredaService,
  cityService,
} from "../../admin/common/makeServices";
import { stateByCountry } from "../../admin/common/makeServices.js";
import { zoneByState } from "../../admin/common/makeServices.js";
import { weredaByZone } from "../../admin/common/makeServices.js";
import { cityByWereda } from "../../admin/common/makeServices.js";

// ......... End of Import .....

export default function TrafficPoliceForm({ initialValues = {}, onCancel }) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [employees, setemployees] = useState([]);
  const [country, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [weredas, setWeredas] = useState([]);
  const [cities, setCities] = useState([]);

  const isEditMode = Boolean(initialValues?._id);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    setImageChanged(false);
  }, [initialValues?._id]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Append normal fields
      Object.keys(values).forEach((key) => {
        if (key !== "profileImage") {
          formData.append(key, values[key] ?? "");
        }
      });

      // // Append image file
      // if (values.profileImage && values.profileImage.length > 0) {
      //   formData.append("profileImage", values.profileImage[0].originFileObj);
      // }
      if (imageChanged && values.profileImage.length > 0) {
        formData.append("profileImage", values.profileImage[0].originFileObj);
      }

      if (isEditMode) {
        if (!imageChanged) {
          formData.delete("profileImage");
        }
        await trafficPoliceServices.update(initialValues._id, formData);
        toast.success("Traffic Police updated successfully");
      } else {
        await trafficPoliceServices.create(formData);

        toast.success("Traffic Police created successfully");
      }

      form.resetFields();
      setImageChanged(false);
      onCancel?.();

      queryClient.invalidateQueries(["trafficPolice"]); // refresh the traffic police list
    } catch (error) {
      toast.error(
        isEditMode
          ? "Error updating traffic police"
          : "Error creating traffic police",
      );
    }
  };

  // Preload countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await countryService.list();
        setCountries(res.data.map((c) => ({ label: c.cName, value: c._id })));
      } catch (err) {
        toast.error("Error loading countries");
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!initialValues) return;

    // 1️⃣ Set all normal fields first (except profileImage)
    const { profileImage, ...otherValues } = initialValues;
    form.setFieldsValue(otherValues);

    // 2️⃣ Preload cascading selects based on initialValues
    const preloadCascades = async () => {
      try {
        if (initialValues.country) {
          const resStates = await stateByCountry.getStateByCountry({
            countryId: initialValues.country,
          });
          setStates(
            resStates.data.map((s) => ({ label: s.stateName, value: s._id })),
          );
        }

        if (initialValues.state) {
          const resZones = await zoneByState.getZoneByState({
            stateId: initialValues.state,
          });
          setZones(
            resZones.data.map((z) => ({ label: z.zoneName, value: z._id })),
          );
        }

        if (initialValues.zone) {
          const resWeredas = await weredaByZone.getWeredaByZone({
            zoneId: initialValues.zone,
          });
          setWeredas(
            resWeredas.data.map((w) => ({ label: w.weredaName, value: w._id })),
          );
        }

        if (initialValues.wereda) {
          const resCities = await cityByWereda.getCityByWereda({
            weredaId: initialValues.wereda,
          });
          setCities(
            resCities.data.map((c) => ({ label: c.cityName, value: c._id })),
          );
        }
      } catch (err) {
        console.error("Error preloading cascades:", err);
      }
    };

    preloadCascades();
  }, [initialValues]);

  //  Show existing profile image in Upload (EDIT mode)
  useEffect(() => {
    if (!initialValues?.profileImage) return;

    // If backend already gave Upload fileList, skip
    if (Array.isArray(initialValues.profileImage)) return;

    const fileList = [
      {
        uid: "-1",
        name: initialValues.profileImage.split("/").pop(),
        status: "done",
        url: import.meta.env.VITE_BACKEND_URL + initialValues.profileImage,
      },
    ];

    // IMPORTANT: wait until Upload is mounted
    setTimeout(() => {
      form.setFieldsValue({ profileImage: fileList });
    }, 0);
  }, [initialValues?.profileImage]);

  // Load countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await countryService.list();
        setCountries(res.data.map((c) => ({ label: c.cName, value: c._id })));
      } catch (err) {
        toast.error("Error loading countries:", err);
      }
    };
    fetchCountries();
  }, []);
  // Handlers for cascading selects
  const onCountryChange = async (countryId) => {
    form.setFieldsValue({ state: null, zone: null, wereda: null, city: null });
    setStates([]);
    setZones([]);
    setWeredas([]);
    setCities([]);

    if (!countryId) return;

    try {
      const res = await stateByCountry.getStateByCountry({ countryId });
      setStates(res.data.map((s) => ({ label: s.stateName, value: s._id })));
    } catch (err) {
      toast.error("Error loading states:", err);
    }
  };
  const onStateChange = async (stateId) => {
    form.setFieldsValue({ zone: null, wereda: null, city: null });
    setZones([]);
    setWeredas([]);
    setCities([]);

    if (!stateId) return;

    try {
      const res = await zoneByState.getZoneByState({ stateId });
      setZones(res.data.map((z) => ({ label: z.zoneName, value: z._id })));
    } catch (err) {
      console.error("Error loading zones:", err);
    }
  };

  const onZoneChange = async (zoneId) => {
    form.setFieldsValue({ wereda: null, city: null });
    setWeredas([]);
    setCities([]);

    if (!zoneId) return;

    try {
      const res = await weredaByZone.getWeredaByZone({ zoneId });
      setWeredas(res.data.map((w) => ({ label: w.weredaName, value: w._id })));
    } catch (err) {
      console.error("Error loading weredas:", err);
    }
  };

  const onWeredaChange = async (weredaId) => {
    form.setFieldsValue({ city: null });
    setCities([]);

    if (!weredaId) return;

    try {
      const res = await cityByWereda.getCityByWereda({ weredaId });
      setCities(res.data.map((c) => ({ label: c.cityName, value: c._id })));
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  const policeFields = [
    {
      name: "country",
      label: "Country",
      type: "select",
      colSpan: 12,
      props: { options: country, placeholder: "Select Country" },
      rules: [{ required: true }],
      onChange: onCountryChange,
    },
    {
      name: "state",
      label: "State",
      type: "select",
      colSpan: 12,
      props: {
        options: [], // dynamic
        placeholder: "Select State",
      },
      rules: [{ required: false }],
      onChange: onStateChange,
    },
    {
      name: "zone",
      label: "Zone",
      type: "select",
      colSpan: 12,
      props: {
        options: [], // dynamic
        placeholder: "Select Zone",
      },
      rules: [{ required: false }],
      onChange: onZoneChange,
    },
    {
      name: "wereda",
      label: "Wereda",
      type: "select",
      colSpan: 12,
      props: {
        options: [], // dynamic
        placeholder: "Select Wereda",
      },
      rules: [{ required: false }],
      onChange: onWeredaChange,
    },
    {
      name: "city",
      label: "CIty",
      type: "select",
      colSpan: 12,
      props: {
        options: [], // dynamic
        placeholder: "Select CIty",
      },
      rules: [{ required: false }],
    },
    {
      name: "fName",
      label: "First Name",
      type: "text",
      colSpan: 12,
      rules: [{ required: true }],
    },
    {
      name: "mName",
      label: "Middle Name",
      type: "text",
      colSpan: 12,
      rules: [{ required: false }],
    },
    {
      name: "lName",
      label: "Last Name",
      type: "text",
      colSpan: 12,
      rules: [{ required: false }],
    },

    { name: "age", label: "Age", type: "number", colSpan: 12 },
    { name: "gender", label: "Gender", type: "text", colSpan: 12 },
    { name: "RID", label: "SSID", type: "text", colSpan: 12 },
    { name: "email", label: "Email", type: "email", colSpan: 12 },
    { name: "phone", label: "Phone", type: "text", colSpan: 12 },
    {
      name: "profileImage",
      label: "Profile Image",
      type: "upload",
      colSpan: 24,
      props: {
        maxCount: 1,
        listType: "picture",
        onChange: () => setImageChanged(true),
      },
    },
  ];
  const dynamicFields = policeFields.map((field) => {
    switch (field.name) {
      case "country":
        return {
          ...field,
          props: {
            ...field.props,
            options: country,
            onChange: onCountryChange,
          },
        };

      case "state":
        return {
          ...field,
          props: {
            ...field.props,
            options: states,
            onChange: onStateChange,
            disabled: !states.length,
          },
        };

      case "zone":
        return {
          ...field,
          props: {
            ...field.props,
            options: zones,
            onChange: onZoneChange,
            disabled: !zones.length,
          },
        };

      case "wereda":
        return {
          ...field,
          props: {
            ...field.props,
            options: weredas,
            onChange: onWeredaChange,
            disabled: !weredas.length,
          },
        };

      case "city":
        return {
          ...field,
          props: {
            ...field.props,
            options: cities,
            disabled: !cities.length,
          },
        };

      default:
        return field;
    }
  });
  const normalizedInitialValues = React.useMemo(() => {
    if (!initialValues) return {};

    const values = { ...initialValues };

    if (typeof values.profileImage === "string") {
      values.profileImage = []; // Upload MUST be array
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
