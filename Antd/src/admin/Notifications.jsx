import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  List,
  Button,
  Tag,
  Space,
  Typography,
  Badge,
  Select,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const Notifications = () => {
  // 🔹 Sample data (you can later fetch this from your backend)
  const initialNotifications = [
    {
      id: 1,
      type: "System",
      title: "System Maintenance Scheduled",
      message: "The system will be down for updates on Oct 12, 2025.",
      time: "2 hours ago",
      read: false,
      icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
    },
    {
      id: 2,
      type: "Driver",
      title: "Driver Shift Completed",
      message: "Driver John Doe completed his 5th trip successfully.",
      time: "4 hours ago",
      read: true,
      icon: <CarOutlined style={{ color: "#52c41a" }} />,
    },
    {
      id: 3,
      type: "Finance",
      title: "Payment Received",
      message: "Payment of $450 received from client ABX Logistics.",
      time: "1 day ago",
      read: false,
      icon: <DollarCircleOutlined style={{ color: "#1890ff" }} />,
    },
    {
      id: 4,
      type: "System",
      title: "New Feature Deployed",
      message: "Company dashboard analytics have been updated.",
      time: "3 days ago",
      read: false,
      icon: <BellOutlined style={{ color: "#722ed1" }} />,
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  // 🔹 Filtering logic
  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  // 🔹 Actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        {/* Summary cards */}
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>
                <BellOutlined /> All Notifications
              </Title>
              <Text strong>{notifications.length}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>
                <CheckCircleOutlined /> Unread Notifications
              </Title>
              <Badge count={unreadCount} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>
                <ExclamationCircleOutlined /> System Alerts
              </Title>
              <Text>Keep track of platform updates & warnings</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filters and list */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Card
            title="Recent Notifications"
            extra={
              <Select
                value={filter}
                onChange={setFilter}
                options={[
                  { label: "All", value: "All" },
                  { label: "System", value: "System" },
                  { label: "Driver", value: "Driver" },
                  { label: "Finance", value: "Finance" },
                ]}
                style={{ width: 150 }}
              />
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      size="small"
                      type="link"
                      onClick={() => markAsRead(item.id)}
                      disabled={item.read}
                    >
                      Mark as Read
                    </Button>,
                    <Button
                      size="small"
                      danger
                      type="link"
                      onClick={() => deleteNotification(item.id)}
                    >
                      Delete
                    </Button>,
                  ]}
                  style={{
                    backgroundColor: item.read ? "#fafafa" : "#e6f7ff",
                    borderRadius: 8,
                    marginBottom: 8,
                    padding: "10px 16px",
                  }}
                >
                  <List.Item.Meta
                    avatar={item.icon}
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag
                          color={
                            item.type === "System"
                              ? "orange"
                              : item.type === "Driver"
                              ? "green"
                              : "blue"
                          }
                        >
                          {item.type}
                        </Tag>
                      </Space>
                    }
                    description={
                      <>
                        <Text>{item.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Notifications;
