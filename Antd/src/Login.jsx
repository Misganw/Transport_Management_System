import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  Radio,
  InputNumber,
  Upload,
  Progress,
  Select,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  InboxOutlined,
  GoogleOutlined,
  FacebookFilled,
  TwitterOutlined,
  GithubOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./context/AppContext.jsx";
import Logo from "./assets/etlogo.jpg";
import "react-toastify/dist/ReactToastify.css";
import "./css/Login.css";

const { Text } = Typography;

// const normFile = (e) => {
//   if (Array.isArray(e)) return e;
//   return e?.fileList;
// };

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

const Login = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendURL, setIsloggedIn, getUserData } = useContext(AppContext);
  const [state, setState] = useState("Login");

  const onClickSignup = () => setState("Signup");
  const onClickLogin = () => setState("Login");

  const [companies, setCompanies] = useState([]);

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/getCompanyId`);
        // Assuming your API returns an array of companies like [{ _id: "123", name: "ABC" }, ...]
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, [backendURL]);

  const onFinish = async (values) => {
    try {
      axios.defaults.withCredentials = true;

      if (state === "Signup") {
        const formData = new FormData();
        const rl = "passenger";
        const st = "Active";
        formData.append("firstName", values.firstName);
        formData.append("middleName", values.middleName || "");
        formData.append("lastName", values.lastName);
        formData.append(
          "name",
          `${values.firstName} ${values.middleName || ""} ${
            values.lastName
          }`.trim(),
        );

        formData.append("age", values.age);
        formData.append("gender", values.gender);
        formData.append("fydano", values.fydano);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("roles", rl);
        formData.append("statuses", st);

        // Add selected company ID
        formData.append("companyId", values.companyId);

        if (values.dragger && values.dragger[0]) {
          formData.append("profileImage", values.dragger[0].originFileObj);
        }

        const { data } = await axios.post(`${backendURL}/register`, formData, {
          withCredentials: true,
        });

        if (data.success) {
          toast.success("Signup Successfully!");
          // setIsloggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // .........Login........
        const { data } = await axios.post(
          `${backendURL}/login`,
          {
            email: values.email,
            password: values.password,
          },
          { withCredentials: true },
        );

        if (data.success) {
          const freshUser = await getUserData();
          setIsloggedIn(true);
          if (freshUser.isVerified) {
            navigate("/adminDashboard");
          } else {
            const { data: otpRes } = await axios.post(
              `${backendURL}/sendingOTP`,
            );
            if (otpRes.success) {
              navigate("/emailVerify");
              toast.success(otpRes.message);
            } else {
              toast.error("Error sending OTP: " + JSON.stringify(otpRes));
            }
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const [passwordStrength, setPasswordStrength] = useState(0);
  const checkStrength = (value) => {
    let strength = 0;
    if (value.length >= 6) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    if (/[^A-Za-z0-9]/.test(value)) strength += 25;
    setPasswordStrength(strength);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <Form layout="vertical" onFinish={onFinish} className="login-form">
          {state === "Signup" && (
            <>
              <div className="signUpHeader">
                <Text style={{ margin: 0 }}>
                  Signup here,if you are Passenger
                </Text>
                {/* Spacer pushes Back button to the right */}
                <Button
                  type="link"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </div>
              {/* Divider under header */}
              <Divider style={{ marginTop: 0, marginBottom: 20 }} />
              <Form.Item
                name="companyId"
                label="Company"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select a company">
                  {companies.map((company) => (
                    <Select.Option key={company._id} value={company._id}>
                      {company.companyName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <div className="signUP">
                {/* Left Signup */}
                <div className="leftSignup">
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      { required: true, message: "Please enter First Name!" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="First Name" />
                  </Form.Item>

                  <Form.Item label="Middle Name" name="middleName">
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Middle Name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      { required: true, message: "Please enter Last Name!" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Last Name" />
                  </Form.Item>

                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      { required: true, message: "Please select your gender!" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                {/* Right Signup */}
                <div className="rightSignup">
                  <Form.Item label="Age" name="age">
                    <InputNumber min={1} max={100} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="SSID(FydaNO)"
                    name="fydano"
                    rules={[
                      { required: true, message: "Please provide Fyda ID!" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="SSID(Fyda No)"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Enter a valid email!" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      onChange={(e) => checkStrength(e.target.value)}
                    />
                  </Form.Item>
                  {passwordStrength > 0 && (
                    <Progress
                      percent={passwordStrength}
                      showInfo={false}
                      strokeColor={
                        passwordStrength < 50
                          ? "#ff4d4f"
                          : passwordStrength < 75
                            ? "#faad14"
                            : "#52c41a"
                      }
                      style={{ marginBottom: 12 }}
                    />
                  )}
                </div>
              </div>

              {/* Profile Image Upload */}
              <Form.Item label="Profile Image">
                <Form.Item
                  name="dragger"
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

              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </>
          )}

          {state === "Login" && (
            <>
              <div className="login-logo">
                <img src={Logo} alt="Logo" />
              </div>
              <h2 className="login-title">Transport Management System</h2>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <div className="login-actions">
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => navigate("/resetPassword")}
                >
                  Forgot Password
                </Button>
              </div>

              <Divider style={{ borderColor: "black" }}>Or Login Via</Divider>
              <div className="login-social">
                <Button
                  shape="circle"
                  icon={<GoogleOutlined />}
                  size="large"
                  onClick={() =>
                    (window.location.href = `${backendURL}/google`)
                  }
                />
                <Button
                  shape="circle"
                  icon={<GithubOutlined />}
                  size="large"
                  onClick={() =>
                    (window.location.href = `${backendURL}/github`)
                  }
                />
                <Button
                  shape="circle"
                  icon={<TwitterOutlined />}
                  size="large"
                />
              </div>
            </>
          )}

          {/* Toggle Signup/Login */}
          <div className="login-signup">
            {state === "Login" ? (
              <>
                <Text>Don’t have an account? </Text>
                <Button type="link" onClick={onClickSignup}>
                  Sign Up
                </Button>
              </>
            ) : (
              <Text>
                Already have an account?{" "}
                <Button type="link" onClick={onClickLogin}>
                  Login
                </Button>
              </Text>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
