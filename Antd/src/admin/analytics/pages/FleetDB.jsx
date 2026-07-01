import React from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Divider,
  Typography,
} from "antd";

import {
  CarOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const FleetDashboard = ({ filters }) => {
  const fleetData = {
    cars: 1250,
    drivers: 720,
    owners: 560,
    activeCars: 980,
  };

  const carTypes = [
    {
      key: 1,
      type: "Bus",
      count: 320,
    },

    {
      key: 2,
      type: "Minibus",
      count: 540,
    },

    {
      key: 3,
      type: "Taxi",
      count: 250,
    },

    {
      key: 4,
      type: "Truck",
      count: 140,
    },
  ];

  const driverData = [
    {
      key: 1,
      name: "Abebe Kebede",
      experience: 12,
      status: "Active",
    },

    {
      key: 2,
      name: "Tesfaye Alemu",
      experience: 8,
      status: "Active",
    },

    {
      key: 3,
      name: "Samuel Bekele",
      experience: 3,
      status: "Suspended",
    },
  ];

  const columns = [
    {
      title: "Driver",
      dataIndex: "name",
    },

    {
      title: "Experience",
      dataIndex: "experience",
      render: (v) => `${v} Years`,
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag>,
    },
  ];

  return (
    <div>
      <Title level={3}>Fleet Analytics</Title>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Cars"
              value={fleetData.cars}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Drivers"
              value={fleetData.drivers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Owners"
              value={fleetData.owners}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Active Cars"
              value={fleetData.activeCars}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Car Type Distribution">
            {carTypes.map((item) => (
              <div key={item.key}>
                <p>{item.type}</p>

                <Progress percent={(item.count / fleetData.cars) * 100} />
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Fleet Utilization">
            <Progress type="circle" percent={78} />

            <p>Active vehicles compared with total fleet</p>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Driver Performance">
            <Table dataSource={driverData} columns={columns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FleetDashboard;
