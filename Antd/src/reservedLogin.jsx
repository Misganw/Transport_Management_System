import React from "react";
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
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  GoogleOutlined,
  FacebookFilled,
  TwitterOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import "./css/Login.css";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/etlogo.jpg";
import { useState, useContext } from "react";
import { AppContext } from "./context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Text } = Typography;

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [firstName, setFName] = useState("");
  const [middleName, setMEmail] = useState("");
  const [lastName, setLName] = useState("");
  const [FydaNo, setFydaNo] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendURL, setIsloggedIn, getUserData, userData, isLoggedIn } =
    useContext(AppContext);
  // .... End of state declaration
  const onClickSignup = () => {
    setState("Login");
  };
  const onClickLogin = () => {
    setState("Signup");
  };
  const onFinish = async (values) => {
    try {
      axios.defaults.withCredentials = true;

      if (state === "Signup") {
        const { data } = await axios.post(`${backendURL}/api/register`, {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        if (data.success) {
          toast.success("Signup Successfuly!.");
          setIsloggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/login`, {
          email: values.email,
          password: values.password,
        });

        if (data.success) {
          // getUserData(); // fetch user info after login
          const freshUser = await getUserData();
          setIsloggedIn(true);
          if (freshUser.isVerified) {
            navigate("/adminDashboard");
          } else {
            const { data: otpRes } = await axios.post(
              backendURL + "/api/sendingOTP"
            );
            if (otpRes.success === true || otpRes.success === "true") {
              setIsloggedIn(true);
              navigate("/emailVerify");
              toast.success(otpRes.message);
            } else {
              toast.error("Error sending OTP: " + JSON.stringify(otpRes));
            }
          }

          // navigate(isLoggedIn ? "/adminDashboard" : "/");
          // return <Navigate to="/adminDashboard" />;
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // console.error("Something went wrong", error);
      toast.error(error.message);
    }
  };
  // .... End of onCLick Activities
  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <Form layout="vertical" onFinish={onFinish} className="login-form">
            {state === "Signup" && (
              <>
                <div className="signUP">
                  {/* Left signup */}
                  <div className="leftSignup">
                    <Form.Item
                      label="First Name"
                      name={"first_name"}
                      rules={[{ message: "First Name!" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter First Name"
                        size="large"
                        value={firstName}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Middle Name"
                      name={"middle_name"}
                      rules={[{ message: "Middle Name!" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter Middle Name"
                        size="large"
                        value={middleName}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Last Name"
                      name={"last_name"}
                      rules={[{ message: "Last Name!" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter Last Name"
                        size="large"
                        value={lastName}
                      />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                      <Radio.Group>
                        <Radio value="Male">M</Radio>
                        <Radio value="Femal">F</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  {/* Right signup */}
                  <div className="rightSignup">
                    <Form.Item label="Age">
                      <Form.Item name="age" noStyle>
                        <InputNumber min={1} max={100} />
                      </Form.Item>
                      <span
                        className="ant-form-text"
                        style={{ marginInlineStart: 8 }}
                      ></span>
                    </Form.Item>
                    <Form.Item
                      label="Fyda No"
                      name="FydaNo"
                      rules={[{ message: "Provide Fyda!" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Fyda"
                        size="large"
                        value={FydaNo}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name={"email"}
                      rules={[
                        { required: true, message: "Please enter your email!" },
                        { type: "email", message: "Enter a valid email!" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter Email"
                        size="large"
                        value={email}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name={"password"}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter Password"
                        size="large"
                        value={password}
                      />
                    </Form.Item>
                  </div>
                </div>
                <Form.Item label="Dragger">
                  <Form.Item
                    name="dragger"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                  >
                    <Upload.Dragger name="files" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload.
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Form.Item>
              </>
            )}
            {state === "Login" && (
              <>
                {/* Logo */}
                <div className="login-logo">
                  <img
                    src={Logo} // replace with your logo URL
                    alt="Logo"
                  />
                </div>

                <h2 className="login-title">Transport Management System</h2>

                <Form.Item
                  label="Email"
                  name={"email"}
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter Email"
                    size="large"
                    value={email}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name={"password"}
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter Password"
                    size="large"
                    value={password}
                  />
                </Form.Item>
              </>
            )}

            <Space>
              {state === "Signup" && (
                <Button type="primary" htmlType="submit">
                  Sign Up
                </Button>
              )}
              {state === "Login" && (
                <div className="login-actions">
                  <Button type="primary" htmlType="submit" size="large">
                    Login
                  </Button>
                  <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    size="large"
                    onClick={() => navigate("/resetPassword")}
                  >
                    Forgot Password
                  </Button>
                </div>
              )}
            </Space>
          </Form>

          {/* Signup Link */}
          <div className="login-signup">
            {state === "Login" ? (
              <>
                <Text>Don’t have an account? </Text>
                <Button type="link" htmlType="link" onClick={onClickLogin}>
                  SignUp
                </Button>
              </>
            ) : (
              <p>
                If you have account,Login here.
                <Button type="link" htmlType="link" onClick={onClickSignup}>
                  Login
                </Button>
              </p>
            )}
          </div>

          {/* Divider */}
          {state === "Login" && (
            <>
              <Divider style={{ borderColor: "black" }}>Or Login Via</Divider>

              {/* Social Buttons */}
              <div className="login-social">
                <Button
                  shape="circle"
                  icon={<GoogleOutlined />}
                  size="large"
                  className="google-btn"
                />
                <Button
                  shape="circle"
                  icon={<FacebookFilled />}
                  size="large"
                  className="facebook-btn"
                />
                <Button
                  shape="circle"
                  icon={<TwitterOutlined />}
                  size="large"
                  className="twitter-btn"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
