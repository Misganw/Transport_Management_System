import React from "react";
import { useState } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

function AdminNewsUpload() {
  return (
    <div>
      <Card
        title="Upload Transport News"
        style={{ maxWidth: 600, margin: "auto", marginTop: 50 }}
      >
        <Form layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter news title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="Enter short description" />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Upload News
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AdminNewsUpload;
