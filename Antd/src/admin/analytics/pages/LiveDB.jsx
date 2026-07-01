import React from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Divider,
  Typography,
  List,
  Avatar,
  Badge,
  Progress,
} from "antd";

import {
  CarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  WarningOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const LiveDashboard = ({ filters }) => {
  //---------------------------------
  // Dummy Data
  //---------------------------------

  const summary = {
    activeVehicles: 245,

    onlineDrivers: 220,

    activeRoutes: 38,

    activeIncidents: 12,
  };

  //---------------------------------
  // Live Vehicles
  //---------------------------------

  const vehicles = [
    {
      key: 1,

      plate: "A12345",

      driver: "Abebe Kebede",

      route: "Addis - Debre Tabor",

      speed: 70,

      status: "Moving",
    },

    {
      key: 2,

      plate: "B88990",

      driver: "Tesfaye Alemu",

      route: "Bahir Dar - Gondar",

      speed: 0,

      status: "Stopped",
    },

    {
      key: 3,

      plate: "C45678",

      driver: "Samuel Bekele",

      route: "Addis - Jimma",

      speed: 55,

      status: "Moving",
    },
  ];

  const columns = [
    {
      title: "Vehicle",

      dataIndex: "plate",
    },

    {
      title: "Driver",

      dataIndex: "driver",
    },

    {
      title: "Route",

      dataIndex: "route",
    },

    {
      title: "Speed",

      dataIndex: "speed",

      render: (v) => `${v} km/h`,
    },

    {
      title: "Status",

      dataIndex: "status",

      render: (s) => <Tag color={s === "Moving" ? "green" : "orange"}>{s}</Tag>,
    },
  ];

  //---------------------------------
  // Active Incidents
  //---------------------------------

  const incidents = [
    {
      id: 1,

      title: "Speed violation",

      vehicle: "A12345",

      location: "Station 12",
    },

    {
      id: 2,

      title: "Passenger report",

      vehicle: "B88990",

      location: "Terminal",
    },
  ];

  return (
    <div>
      <Title level={3}>Live Transport Monitoring</Title>

      <Divider />

      {/* =============================
        KPI CARDS
================================ */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Vehicles"
              value={summary.activeVehicles}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Online Drivers"
              value={summary.onlineDrivers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Routes"
              value={summary.activeRoutes}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Incidents"
              value={summary.activeIncidents}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* =============================
       LIVE MAP
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Live Vehicle Map">
            <div
              style={{
                height: 350,

                background: "#f5f5f5",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                borderRadius: 8,
              }}
            >
              <Typography.Text>
                Live GPS Map Area
                <br />
                (Leaflet / Google Maps + Socket.IO)
              </Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* =============================
       VEHICLE TABLE
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Currently Active Vehicles">
            <Table dataSource={vehicles} columns={columns} pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* =============================
       DRIVER ACTIVITY
================================ */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Driver Activity">
            <List
              dataSource={vehicles}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.driver}
                    description={`${item.route} - ${item.speed} km/h`}
                  />

                  <Badge
                    status={item.status === "Moving" ? "success" : "warning"}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Vehicle Operation Status">
            <p>Moving Vehicles</p>

            <Progress percent={75} status="active" />

            <p>Stopped Vehicles</p>

            <Progress percent={15} />

            <p>Offline Vehicles</p>

            <Progress percent={10} />
          </Card>
        </Col>
      </Row>

      {/* =============================
       INCIDENTS
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Live Incidents">
            <Table
              dataSource={incidents}
              columns={[
                {
                  title: "Issue",

                  dataIndex: "title",
                },

                {
                  title: "Vehicle",

                  dataIndex: "vehicle",
                },

                {
                  title: "Location",

                  dataIndex: "location",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LiveDashboard;
