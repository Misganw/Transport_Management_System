/* =============================
src/modules/common/DynamicForm.jsx
A tiny form generator used as modal or inline editor
Adds SAVE + CANCEL buttons
============================= */
import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Space,
  Upload,
  Checkbox,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const componentMapper = {
  text: (props) => <Input {...props} />,
  email: (props) => <Input {...props} />,
  number: (props) => <InputNumber style={{ width: "100%" }} {...props} />,
  select: ({ options, ...p }) => <Select options={options} {...p} />,
  date: (props) => <DatePicker style={{ width: "100%" }} {...props} />,
  textarea: (props) => <Input.TextArea rows={4} {...props} />,
  checkbox: (props) => <Checkbox {...props} />,

  // NEW: Upload component
  upload: ({ maxCount = 1, listType = "picture", ...rest }) => (
    <Upload.Dragger
      beforeUpload={() => false} // prevent auto upload
      maxCount={maxCount}
      listType={listType}
      {...rest}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to upload</p>
      <p className="ant-upload-hint">Support single file only</p>
    </Upload.Dragger>
  ),
};

export default function DynamicForm({
  fields = [],
  initialValues = {},
  form,
  onFinish,
  onCancel, // <-- NEW
}) {
  useEffect(() => {
    if (form) form.setFieldsValue(initialValues || {});
  }, [initialValues]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Row gutter={[12, 12]}>
        {fields.map((f) => (
          <Col xs={24} sm={f.colSpan || 12} key={f.name}>
            <Form.Item
              name={f.name}
              label={f.label}
              rules={f.rules || []}
              valuePropName={f.type === "upload" ? "fileList" : "value"}
              getValueFromEvent={
                f.type === "upload"
                  ? (e) => {
                      if (!e) return [];
                      return Array.isArray(e) ? e : e.fileList || [];
                    }
                  : undefined // (e) => {
                //     if (Array.isArray(e)) return e;
                //     return e?.fileList;
                //   }
              }
            >
              {componentMapper[f.type || "text"](f.props || {})}
            </Form.Item>
          </Col>
        ))}
      </Row>

      {/* ---------------- SAVE + CANCEL BUTTONS ---------------- */}
      <Form.Item style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>

          {onCancel && (
            <Button danger onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
