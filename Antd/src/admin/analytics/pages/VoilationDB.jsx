import React from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Progress,
  Divider,
  Typography,
  List,
} from "antd";

import {
  WarningOutlined,
  DollarOutlined,
  CarOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ViolationDashboard = ({ filters }) => {
  //------------------------------------
  // Dummy data
  // Replace with API aggregation later
  //------------------------------------

  const summary = {
    totalReports: 850,

    punishedDrivers: 230,

    totalPenalty: 560000,

    paidPenalty: 420000,
  };

  //------------------------------------
  // Monthly violation trend
  //------------------------------------

  const monthlyViolation = [
    {
      month: "January",
      count: 120,
    },

    {
      month: "February",
      count: 150,
    },

    {
      month: "March",
      count: 180,
    },

    {
      month: "April",
      count: 200,
    },

    {
      month: "May",
      count: 110,
    },
  ];

  //------------------------------------
  // Violation by rule
  //------------------------------------

  const ruleData = [
    {
      key: 1,
      rule: "Over Speed",
      count: 320,
    },

    {
      key: 2,
      rule: "Wrong Station Stop",
      count: 210,
    },

    {
      key: 3,
      rule: "Driver Misconduct",
      count: 160,
    },

    {
      key: 4,
      rule: "Over Loading",
      count: 90,
    },
  ];

  //------------------------------------
  // Route risk analysis
  //------------------------------------

  const routeData = [
    {
      key: 1,

      route: "Addis - Gondar",

      violations: 250,

      risk: "High",
    },

    {
      key: 2,

      route: "Bahir Dar - Debre Tabor",

      violations: 180,

      risk: "Medium",
    },

    {
      key: 3,

      route: "Addis - Jimma",

      violations: 90,

      risk: "Low",
    },
  ];

  const driverRanking = [
    {
      key: 1,

      driver: "Abebe Kebede",

      violations: 35,
    },

    {
      key: 2,

      driver: "Tesfaye Alemu",

      violations: 28,
    },

    {
      key: 3,

      driver: "Samuel Bekele",

      violations: 21,
    },
  ];

  return (
    <div>
      <Title level={3}>Violation Analytics</Title>

      <Divider />

      {/* ==========================
        KPI CARDS
=========================== */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Reports"
              value={summary.totalReports}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Punished Drivers"
              value={summary.punishedDrivers}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Penalty Amount"
              value={summary.totalPenalty}
              suffix="ETB"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Paid Penalties"
              value={summary.paidPenalty}
              suffix="ETB"
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ==========================
       MONTHLY TREND
=========================== */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly Violation Trend">
            <List
              dataSource={monthlyViolation}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: "100%" }}>
                    <p>{item.month}</p>

                    <Progress
                      percent={(item.count / 250) * 100}
                      status="active"
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* ==========================
       RULE ANALYSIS
=========================== */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Most Violated Rules">
            <Table
              dataSource={ruleData}
              columns={[
                {
                  title: "Rule",

                  dataIndex: "rule",
                },

                {
                  title: "Count",

                  dataIndex: "count",
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Penalty Payment Progress">
            <Progress
              type="circle"
              percent={Math.round(
                (summary.paidPenalty / summary.totalPenalty) * 100,
              )}
            />

            <p>Paid vs Generated Penalties</p>
          </Card>
        </Col>
      </Row>

      {/* ==========================
        ROUTE RISK
=========================== */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Route Violation Risk">
            <Table
              dataSource={routeData}
              columns={[
                {
                  title: "Route",

                  dataIndex: "route",
                },

                {
                  title: "Violations",

                  dataIndex: "violations",
                },

                {
                  title: "Risk",

                  dataIndex: "risk",

                  render: (risk) => (
                    <Tag
                      color={
                        risk === "High"
                          ? "red"
                          : risk === "Medium"
                            ? "orange"
                            : "green"
                      }
                    >
                      {risk}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* ==========================
       DRIVER RANKING
=========================== */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Driver Violation Ranking">
            <Table
              dataSource={driverRanking}
              columns={[
                {
                  title: "Driver",

                  dataIndex: "driver",
                },

                {
                  title: "Violation Count",

                  dataIndex: "violations",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViolationDashboard;
