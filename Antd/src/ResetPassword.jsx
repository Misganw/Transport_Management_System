import React from "react";
import { useContext, useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import "./css/PasswordReset.css";
import { useNavigate } from "react-router-dom";
import ProvidingOTP from "./verify/ProvidingOTP.jsx";
import PasswordEntry from "./verify/PasswordEntry.jsx";
import { AppContext } from "./context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Text } = Typography;
function ResetPassword() {
  const { backendURL } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSubmitted, setOtpSubmitted] = useState(false);

  const onFinish = async () => {
    // values.preventDefault();
    try {
      const { data } = await axios.post(backendURL + "/resetOTP", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setEmailSent(true);
        // navigate("/ResettingOTP");
      } else {
        toast.error(data.message);
        navigate("/ResettingOTP");
      }
    } catch (error) {
      toast.error(
        toast.error(
          error.response?.data?.message || "Server timeout. Please try again."
        )
      );
    }
  };

  // Step 2: OTP submission
  const handleOtpSubmit = (otpValue) => {
    console.log("Received OTP from child:", otpValue);
    setOtp(otpValue);
    setOtpSubmitted(true);
    toast.success("OTP verified successfully! (frontend only)");
  };

  const onSubmitNewPassword = async (newPassword) => {
    try {
      const { data } = await axios.post(`${backendURL}/resetpassword`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/IndexPage");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <>
      {!emailSent && (
        <div className="reset-page">
          <div className="reset-container">
            {/* Header */}
            <div className="reset-header">
              <h3 className="header-title">Reset Your Password</h3>
              <a href="/IndexPage" className="header-home">
                <HomeOutlined />
              </a>
            </div>

            <Divider style={{ margin: "10px 0 20px", borderColor: "black" }} />

            <Text type="secondary" className="reset-subtitle">
              Provide your email to reset your password
            </Text>

            {/* Form */}
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Provide Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  size="large"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
      {emailSent && !otpSubmitted && (
        <ProvidingOTP
          onOTPSubmit={handleOtpSubmit}
          email={email}
          otpsub={otpSubmitted}
        />
      )}

      {otpSubmitted && (
        <PasswordEntry onSubmitNewPassword={onSubmitNewPassword} />
      )}
    </>
  );
}
export default ResetPassword;
