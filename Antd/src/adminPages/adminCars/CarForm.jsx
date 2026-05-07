import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const CarForm = ({ open, editing, onSubmit, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) form.setFieldsValue(editing);
    else form.resetFields();
  }, [editing]);

  const handleFinish = (values) => onSubmit(values);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editing ? "Edit Car" : "Add Car"}
      onOk={() => form.submit()}
      okText="Save"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="type" label="Car Type" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="model" label="Model" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="plateNumber"
          label="Plate Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="level" label="Level">
          <Select
            options={[
              { label: "1ኛ ደረጃ", value: "1ኛ ደረጃ" },
              { label: "2ኛ ደረጃ", value: "2ኛ ደረጃ" },
              { label: "3ኛ ደረጃ", value: "3ኛ ደረጃ" },
            ]}
          />
        </Form.Item>

        <Form.Item name="NoofSeats" label="Number of Seats">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarForm;
