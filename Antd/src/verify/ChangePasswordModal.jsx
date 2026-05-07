import React, { useState, useContext } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import "../css/Modal.css";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext.jsx";

const ChangePasswordModal = ({ open, onClose }) => {
  const { backendURL, setIsloggedIn, getUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { currentPassword, newPassword } = values;

      const res = await axios.put(
        `${backendURL}/changepassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      message.success(res.data.message);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <Modal title="Change Password" open={open} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Enter your current password" }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Enter a new password" },
            { min: 6, message: "Minimum 6 characters" },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Update Password
        </Button>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
