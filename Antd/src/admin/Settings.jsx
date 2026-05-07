import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Upload,
  Spin,
  Alert,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  UploadOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "react-toastify";

const { Option } = Select;
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

const Settings = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [preferenceForm] = Form.useForm();
  const [countriesPhoneCode, setCountriesPhoneCode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("");

  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);
  };

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
  };

  // ..... get company setting info .......
  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const backendURL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const { data } = await axios.get(`${backendURL}/getComById`, {
          withCredentials: true,
        });

        if (data?.companies) {
          // Parse the phone using libphonenumber-js
          const phone = parsePhoneNumberFromString(data.companies.phone);

          if (phone) {
            form.setFieldsValue({
              companyName: data.companies.companyName,
              email: data.companies.email,
              country: phone.country, // auto-fill country
              phoneCode: "+" + phone.countryCallingCode,
              phoneNumber: phone.nationalNumber,
            });

            // update state
            setPhoneCode("+" + phone.countryCallingCode);
            setSelectedCountry(phone.country);
            // setSelectedTimezone(data.companies.defaultTimezone);
          } else {
            console.warn("Failed to parse phone number:", data.companies.phone);
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchCompanySettings();
  }, []);

  // ..... get countries phone code .......
  useEffect(() => {
    const fetchCountriesPhoneCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/countriesPhoneCode"
        );

        setCountriesPhoneCode(response.data.countriesPhoneCode);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Could not load countries from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesPhoneCode();
  }, []);

  // UNIVERSAL validator
  const validatePhone = (_, value) => {
    if (!value) return Promise.reject("Enter phone number");

    // Leading 0 is not allowed in international numbers
    if (value.startsWith("0")) {
      return Promise.reject("Phone number cannot start with 0");
    }

    const full = `${phoneCode}${value}`;
    const phone = parsePhoneNumberFromString(full);

    if (!phone || !phone.isValid()) {
      return Promise.reject("Invalid phone number for selected country");
    }

    return Promise.resolve();
  };

  // ..... get currencies and timezone data .......
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [currRes, tzRes] = await Promise.all([
          axios.get("http://localhost:5000/currencies"),
          axios.get("http://localhost:5000/timezones"),
        ]);
        setCurrencies(currRes.data.currencies);
        setTimezones(tzRes.data.timezones);
      } catch (err) {
        message.error("Failed to load currencies or timezones");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ..... get  company preference data .......
  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const backendURL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        const { data } = await axios.get(`${backendURL}/get_Preference`, {
          withCredentials: true,
        });

        if (data.preference) {
          preferenceForm.setFieldsValue({
            currency: data.preference.currency,
            timeZone: data.preference.timeZone,
            visibility: data.preference.visibility,
          });

          setSelectedCurrency(data.preference.currency);
          setSelectedTimezone(data.preference.timeZone);
          setSelectedVisibility(data.preference.visibility);
        }
      } catch (err) {
        console.error("Failed to load preferences");
      }
    };

    fetchPreference();
  }, []);

  // const handleCurrrencySubmit = (values) => {
  //   const full = `${values.phoneCode}${values.phoneNumber}`;
  //   const phone = parsePhoneNumberFromString(full);

  //   if (!phone || !phone.isValid()) {
  //     message.error("Invalid phone number.");
  //     return;
  //   }

  //   const finalPhone = phone.number; // E.164 format

  //   console.log("Submitting:", {
  //     ...values,
  //     phone: finalPhone, // save this to DB
  //   });

  //   message.success("Phone saved: " + finalPhone);
  // };

  if (loading) return <Spin />;

  if (error) {
    return (
      <Alert
        message="Connection Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  const handleSubmit = async (values) => {
    const backendURL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    try {
      axios.defaults.withCredentials = true;

      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append(
        "phone",
        `${values.phoneCode}${values.phoneNumber}`.trim()
      );

      if (values.profileImage && values.profileImage.length > 0) {
        formData.append("profileImage", values.profileImage[0].originFileObj);
      }

      const { data } = await axios.put(
        `${backendURL}/updateCompany`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Registered Successfully!");
        // setIsloggedIn(true);
        navigate("/");
      } else {
        toast.error(error.response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCurrrencyUpdate = async (values) => {
    const backendURL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    try {
      const { data } = await axios.put(
        `${backendURL}/up_Preference`,
        values,

        {
          withCredentials: true,
        }
      );

      if (data.success) toast.success("Preferences updated!");
    } catch (err) {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Company Profile"
            variant={false}
            extra={
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            }
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
                <Input placeholder="Contact email" />
              </Form.Item>

              {/* PHONE NUMBER SECTION */}
              <Form.Item label="Phone Number">
                <Row gutter={8}>
                  {/* COUNTRY SELECT */}
                  <Col span={10}>
                    <Form.Item
                      name="country"
                      rules={[{ required: true, message: "Select country" }]}
                      noStyle
                    >
                      <Select
                        showSearch
                        placeholder="Select country"
                        onChange={(countryName) => {
                          setSelectedCountry(countryName);

                          const selected = countriesPhoneCode.find(
                            (c) => c.name === countryName
                          );

                          if (selected) {
                            setPhoneCode(selected.dial_code);
                            form.setFieldsValue({
                              phoneCode: selected.dial_code,
                            });
                          }
                        }}
                        filterOption={(input, option) =>
                          String(option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {countriesPhoneCode.map((item) => (
                          <Option key={item.name} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* PHONE CODE */}
                  <Col span={6}>
                    <Form.Item name="phoneCode" noStyle>
                      <Input value={phoneCode} disabled />
                    </Form.Item>
                  </Col>

                  {/* LOCAL NUMBER */}
                  <Col span={8}>
                    <Form.Item
                      name="phoneNumber"
                      noStyle
                      rules={[{ validator: validatePhone }]}
                    >
                      <Input placeholder="Phone number" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Profile Image Upload */}
              <Form.Item label="Profile Image">
                <Form.Item
                  name="profileImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload.Dragger
                    name="profileImage"
                    maxCount={1}
                    beforeUpload={() => false} // prevent automatic upload
                    listType="picture"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for single file upload.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* RIGHT SIDE PANEL */}
        <Col xs={24} md={12}>
          <Card title="System Preferences" variant={false}>
            <Form
              form={preferenceForm}
              layout="vertical"
              onFinish={handleCurrrencyUpdate}
              initialValues={{
                currency: selectedCurrency,
                timeZone: selectedTimezone,
                visibility: selectedVisibility || "private",
              }}
            >
              <Form.Item label="Default Currency" name="currency">
                <Select
                  showSearch
                  value={selectedCurrency}
                  onChange={(value) => {
                    setSelectedCurrency(value);
                    preferenceForm.setFieldsValue({ currency: value });
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    String(option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {currencies?.map((c, index) => (
                    <Option key={index} value={c.code}>
                      {c.name} ({c.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Time Zone" name="timeZone">
                <Select
                  showSearch
                  value={selectedTimezone}
                  onChange={(value) => {
                    setSelectedTimezone(value);
                    preferenceForm.setFieldsValue({ timeZone: value });
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {timezones.map((tz) => (
                    <Option key={tz} value={tz}>
                      {tz}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Data Visibility" name="visibility">
                <Select
                  value={selectedVisibility}
                  onChange={(value) => {
                    setSelectedVisibility(value);
                    preferenceForm.setFieldsValue({ visibility: value });
                  }}
                >
                  <Select.Option value="private">
                    Private (Company Only)
                  </Select.Option>
                  <Select.Option value="shared">
                    Shared (Partner Access)
                  </Select.Option>
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Update Preferences
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
