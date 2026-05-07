import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { useRef, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import "../css/EmailVerify.css";
import {
  Cascader,
  DatePicker,
  Typography,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TimePicker,
  TreeSelect,
  Button,
  Space,
  Flex,
} from "antd";
import axios from "axios";
import { toast } from "react-toastify";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function ProvidingOTP({ onOTPSubmit, email, otpsub }) {
  const [otp, setOtp] = useState("");

  console.log("OTPSubmitted!", otpsub);
  console.log("ProvidingOTP component rendered");
  console.log("Received props:", { onOTPSubmit });

  const onFinish = () => {
    if (!otp) return;
    onOTPSubmit(otp);
    console.log("emailSent!", email);
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <Typography.Title level={3} className="otp-title">
          Email Verification
        </Typography.Title>
        <Typography.Text type="secondary">
          Provide the 6-digit code sent to your email
        </Typography.Text>

        <Form className="otp-form" onFinish={onFinish}>
          <Flex justify="center" className="otp-input-wrapper">
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Please input the OTP!" }]}
            >
              <Input.OTP
                length={6}
                size="large"
                value={otp}
                onChange={(value) => setOtp(value)}
              />
            </Form.Item>
          </Flex>

          <Button type="primary" htmlType="submit" block className="otp-submit">
            Verify
          </Button>
        </Form>
      </div>
    </div>
  );
}
export default ProvidingOTP;
