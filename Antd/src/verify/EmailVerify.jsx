import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { useRef, useContext, useEffect } from "react";
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

function EmailVerify() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendURL, getUserData } = useContext(AppContext);

  const onSubmitHandler = async (values) => {
    try {
      const { otp } = values;

      const { data } = await axios.post(backendURL + "/verifyemailwithOTP", {
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/dashboard"); // redirect after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
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

        <Form className="otp-form" onFinish={onSubmitHandler}>
          <Flex justify="center" className="otp-input-wrapper">
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Please input the OTP!" }]}
            >
              <Input.OTP length={6} size="large" />
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
export default EmailVerify;
