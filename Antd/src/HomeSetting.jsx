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
  const [countriesPhoneCode, setCountriesPhoneCode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedTimezone, setSelectedTimezone] =
    useState("Africa/Addis_Ababa");

  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);
  };

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
  };

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

  const handleCurrrencySubmit = (values) => {
    const full = `${values.phoneCode}${values.phoneNumber}`;
    const phone = parsePhoneNumberFromString(full);

    if (!phone || !phone.isValid()) {
      message.error("Invalid phone number.");
      return;
    }

    const finalPhone = phone.number; // E.164 format

    console.log("Submitting:", {
      ...values,
      phone: finalPhone, // save this to DB
    });

    message.success("Phone saved: " + finalPhone);
  };

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

      const { data } = await axios.post(
        `${backendURL}/registerCompany`,
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

  return (
    <div style={{ padding: 20 }}>
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
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
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
            </Col>
            <Col xs={24} md={12}>
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
            </Col>
          </Row>
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
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* RIGHT SIDE PANEL */}
      {/* <Col xs={24} md={12}>
          <Card title="System Preferences" variant={false}>
            <Form layout="vertical" onFinish={handleCurrrencySubmit}>
              <Form.Item label="Default Currency">
                <Select
                  showSearch
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const label = String(option?.children ?? "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {currencies?.map((c, index) => (
                    <Option key={index} value={c.code}>
                      {c.name} ({c.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Time Zone">
                <Select
                  showSearch
                  value={selectedTimezone}
                  onChange={handleTimezoneChange}
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

              <Form.Item label="Data Visibility">
                <Select defaultValue="private">
                  <Select.Option value="private">
                    Private (Company Only)
                  </Select.Option>
                  <Select.Option value="shared">
                    Shared (Partner Access)
                  </Select.Option>
                </Select>
              </Form.Item>

              <Button type="primary" block>
                Update Preferences
              </Button>
            </Form>
          </Card>
        </Col> */}
    </div>
  );
};

export default Settings;
