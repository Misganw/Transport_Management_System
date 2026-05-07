import React, { useEffect, useState } from "react";
import { Card, Table, Button, Input, Space, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CarForm from "./CarForm";

function Cars() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    const res = await getCars(search);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleSubmit = async (values) => {
    if (editing) {
      await updateCar(editing._id, values);
      message.success("Car updated");
    } else {
      await addCar(values);
      message.success("Car added");
    }
    setOpen(false);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteCar(id);
    message.success("Car deleted");
    loadData();
  };

  const columns = [
    { title: "Type", dataIndex: "type" },
    { title: "Model", dataIndex: "model" },
    { title: "Plate Number", dataIndex: "plateNumber" },
    { title: "Level", dataIndex: "level" },
    { title: "Seats", dataIndex: "NoofSeats" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Delete Car?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Cars Management"
      extra={
        <Space>
          <Input.Search
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Add Car
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <CarForm
        open={open}
        editing={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}

export default Cars;
