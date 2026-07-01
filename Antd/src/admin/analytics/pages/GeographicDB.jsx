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
  EnvironmentOutlined,
  HeatMapOutlined,
  CarOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const GeographicDashboard = ({ filters }) => {
  // -----------------------------------
  // Dummy Data
  // Replace with API later
  // -----------------------------------

  const summary = {
    routes: 45,

    subRoutes: 132,

    activeStations: 68,

    totalViolations: 850,
  };

  const routePerformance = [
    {
      key: 1,
      route: "Addis Ababa - Debre Tabor",
      passengers: 5400,
      violations: 85,
      revenue: 650000,
    },

    {
      key: 2,
      route: "Bahir Dar - Gondar",
      passengers: 4200,
      violations: 120,
      revenue: 530000,
    },

    {
      key: 3,
      route: "Awassa - Addis",
      passengers: 3500,
      violations: 60,
      revenue: 420000,
    },
  ];

  const subRouteData = [
    {
      key: 1,
      name: "Station A - Market",
      activity: 90,
    },

    {
      key: 2,
      name: "Station B - Terminal",
      activity: 75,
    },

    {
      key: 3,
      name: "Station C - Center",
      activity: 60,
    },
  ];

  const columns = [
    {
      title: "Route",

      dataIndex: "route",
    },

    {
      title: "Passengers",

      dataIndex: "passengers",
    },

    {
      title: "Violations",

      dataIndex: "violations",

      render: (v) => <Tag color="red">{v}</Tag>,
    },

    {
      title: "Revenue",

      dataIndex: "revenue",

      render: (v) => `${v.toLocaleString()} ETB`,
    },
  ];

  return (
    <div>
      <Title level={3}>Geographic Analytics</Title>

      <Divider />

      {/* ===============================
             KPI CARDS
      ================================= */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Routes"
              value={summary.routes}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sub Routes"
              value={summary.subRoutes}
              prefix={<HeatMapOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Stations"
              value={summary.activeStations}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Violations"
              value={summary.totalViolations}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ===============================
          ROUTE PERFORMANCE
      ================================= */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Route Performance">
            <Table
              columns={columns}
              dataSource={routePerformance}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* ===============================
           SUB ROUTE ACTIVITY
      ================================= */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Sub Route Activity">
            {subRouteData.map((item) => (
              <div
                key={item.key}
                style={{
                  marginBottom: 20,
                }}
              >
                <p>{item.name}</p>

                <Progress percent={item.activity} status="active" />
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Violation Density">
            <Progress type="circle" percent={72} />

            <p>High violation concentration detected</p>
          </Card>
        </Col>
      </Row>

      {/* ===============================
              MAP PLACEHOLDER
         Later Leaflet / Google Map
      ================================= */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Route Map">
            <div
              style={{
                height: 350,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                background: "#f5f5f5",

                borderRadius: 8,
              }}
            >
              <Typography.Text>
                Map Integration Area
                <br />
                (Leaflet / Google Maps)
              </Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ===============================
             TOP PROBLEM ROUTES
      ================================= */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="High Risk Routes">
            <Table
              dataSource={[
                {
                  key: 1,

                  route: "Bahir Dar - Gondar",

                  risk: "High",
                },

                {
                  key: 2,

                  route: "Addis - Jimma",

                  risk: "Medium",
                },
              ]}
              columns={[
                {
                  title: "Route",

                  dataIndex: "route",
                },

                {
                  title: "Risk",

                  dataIndex: "risk",

                  render: (v) => (
                    <Tag color={v === "High" ? "red" : "orange"}>{v}</Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeographicDashboard;
