import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  List,
  Avatar,
  Typography,
  Divider,
} from "antd";

import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import KPIWidget from "../charts/KPIWidget.jsx";
import StatisticCard from "../charts/StatisticCard.jsx";
import PieChart from "../charts/PieChart.jsx";

const { Title, Text } = Typography;

const UserDashboard = () => {
  //-------------------------------------
  // Dummy Data (Later from API)
  //-------------------------------------

  const summary = {
    totalUsers: 5230,
    passengers: 4380,
    drivers: 520,
    officers: 145,
    coordinators: 42,
    admins: 8,
    activeUsers: 4721,
  };

  //-------------------------------------
  // Recent Users
  //-------------------------------------

  const recentUsers = [
    {
      key: 1,
      name: "Abebe Kebede",
      role: "Passenger",
      status: "Active",
    },
    {
      key: 2,
      name: "Tesfaye Alemu",
      role: "Driver",
      status: "Active",
    },
    {
      key: 3,
      name: "Samuel Bekele",
      role: "Officer",
      status: "Inactive",
    },
    {
      key: 4,
      name: "Helen Tadesse",
      role: "Coordinator",
      status: "Active",
    },
  ];

  //-------------------------------------
  // Registration Trend
  //-------------------------------------

  const monthlyRegistration = [
    { month: "Jan", users: 320 },
    { month: "Feb", users: 280 },
    { month: "Mar", users: 390 },
    { month: "Apr", users: 420 },
    { month: "May", users: 510 },
    { month: "Jun", users: 480 },
  ];

  //-------------------------------------
  // Table Columns
  //-------------------------------------

  const columns = [
    {
      title: "User",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
  ];

  //-------------------------------------

  const userData = [
    {
      value: 5400,
      name: "Passengers",
    },

    {
      value: 420,
      name: "Drivers",
    },

    {
      value: 90,
      name: "Officers",
    },

    {
      value: 20,
      name: "Admins",
    },
  ];

  return (
    <div>
      <Title level={3}>User Analytics</Title>

      <Divider />

      {/* ================================
            KPI CARDS
      ================================= */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={summary.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Passengers"
              value={summary.passengers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Drivers"
              value={summary.drivers}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Traffic Officers"
              value={summary.officers}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ================================
          SECOND ROW
      ================================= */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <PieChart title="System Users" data={userData} />
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Active Users">
            <Statistic value={summary.activeUsers} prefix={<RiseOutlined />} />

            <Progress percent={90} status="active" />
          </Card>
        </Col>
      </Row>

      {/* ================================
            Monthly Registration
      ================================= */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly User Registration">
            <Table
              pagination={false}
              dataSource={monthlyRegistration}
              columns={[
                {
                  title: "Month",
                  dataIndex: "month",
                },
                {
                  title: "Registered Users",
                  dataIndex: "users",
                },
              ]}
              rowKey={(record) => record._id || record.id}
            />
          </Card>
        </Col>
      </Row>

      {/* ================================
            Recent Users
      ================================= */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Recently Registered Users">
            <Table
              pagination={{ pageSize: 5 }}
              columns={columns}
              dataSource={recentUsers}
              rowKey={(record) => record._id || record.id}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
