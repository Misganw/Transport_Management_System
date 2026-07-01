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
  List,
} from "antd";

import {
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  DollarOutlined,
  WarningOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const OverviewDashboard = ({ filters }) => {
  //--------------------------------
  // Summary KPI
  //--------------------------------

  const summary = {
    cars: 1250,

    drivers: 720,

    routes: 45,

    subroutes: 132,

    users: 5230,

    tickets: 32500,

    revenue: 28500000,

    violations: 850,

    programs: 560,

    activeVehicles: 245,
  };

  //--------------------------------
  // Monthly performance
  //--------------------------------

  const monthlyData = [
    {
      key: 1,
      month: "January",
      tickets: 4200,
      revenue: 3500000,
      violations: 90,
    },

    {
      key: 2,
      month: "February",
      tickets: 5100,
      revenue: 4200000,
      violations: 120,
    },

    {
      key: 3,
      month: "March",
      tickets: 6200,
      revenue: 5200000,
      violations: 150,
    },
  ];

  //--------------------------------
  // Top routes
  //--------------------------------

  const routes = [
    {
      key: 1,
      route: "Addis - Gondar",
      tickets: 5400,
      violations: 120,
    },

    {
      key: 2,
      route: "Bahir Dar - Addis",
      tickets: 4300,
      violations: 90,
    },

    {
      key: 3,
      route: "Debre Tabor - Addis",
      tickets: 3200,
      violations: 60,
    },
  ];

  return (
    <div>
      <Title level={3}>Transport Management Overview</Title>

      <Divider />

      {/* ===============================
      KPI CARDS
================================ */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Cars"
              value={summary.cars}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Drivers"
              value={summary.drivers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Routes"
              value={summary.routes}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="System Users"
              value={summary.users}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tickets Sold"
              value={summary.tickets}
              prefix={<QrcodeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={summary.revenue}
              suffix="ETB"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Violations"
              value={summary.violations}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Daily Programs"
              value={summary.programs}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ===============================
       OPERATION STATUS
================================ */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Fleet Status">
            <p>Active Vehicles</p>

            <Progress
              percent={Math.round(
                (summary.activeVehicles / summary.cars) * 100,
              )}
              status="active"
            />

            <p>Inactive Vehicles</p>

            <Progress percent={22} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Ticket Payment Status">
            <Progress percent={86} status="active" />

            <p>Paid tickets percentage</p>
          </Card>
        </Col>
      </Row>

      {/* ===============================
       MONTHLY PERFORMANCE
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly Performance">
            <Table
              dataSource={monthlyData}
              columns={[
                {
                  title: "Month",

                  dataIndex: "month",
                },

                {
                  title: "Tickets",

                  dataIndex: "tickets",
                },

                {
                  title: "Revenue",

                  dataIndex: "revenue",

                  render: (v) => `${v.toLocaleString()} ETB`,
                },

                {
                  title: "Violations",

                  dataIndex: "violations",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* ===============================
       TOP ROUTES
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Top Performing Routes">
            <Table
              dataSource={routes}
              columns={[
                {
                  title: "Route",

                  dataIndex: "route",
                },

                {
                  title: "Tickets",

                  dataIndex: "tickets",
                },

                {
                  title: "Violations",

                  dataIndex: "violations",

                  render: (v) => <Tag color="red">{v}</Tag>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* ===============================
       SYSTEM HEALTH
================================ */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="System Activity">
            <List
              dataSource={[
                "245 vehicles currently online",

                "38 active routes running",

                "12 active violation cases",

                "85 drivers completed trips today",
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewDashboard;
