import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
  Progress,
  message,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "../css/PasswordEntry.css";
import Password from "antd/es/input/Password";

const { Title, Text } = Typography;

function PasswordEmtry({ onSubmitNewPassword }) {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const checkStrength = (value) => {
    let strength = 0;
    if (value.length >= 6) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    if (/[^A-Za-z0-9]/.test(value)) strength += 25;
    setPasswordStrength(strength);
  };

  const onsubmit = (values) => {
    const password = values.password;
    if (!password || password.trim().length < 6) {
      message.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    onSubmitNewPassword(password); // send to parent

    setTimeout(() => {
      setLoading(false);
      message.success("Password reset successful!");
    }, 1500);
  };

  return (
    <div className="reset-page">
      {/* <div className="reset-wrapper"> */}
      <Card className="reset-card" variant={false}>
        <div className="reset-header">
          <Title level={3}>Reset Password</Title>
          <Text type="secondary">Please enter yournew password.</Text>
        </div>

        <Form layout="vertical" onFinish={onsubmit} autoComplete="off">
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              size="large"
              // value={newPassword}
              onChange={(e) => checkStrength(e.target.value)}
              // onChange={(value) => {
              //   checkStrength(value);
              //   setNewPassword(value);
              // }}
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

          {/* <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm password"
              size="large"
            />
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    // </div>
  );
}

export default PasswordEmtry;
