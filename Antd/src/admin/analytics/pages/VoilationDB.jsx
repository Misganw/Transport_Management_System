import React, { useState, useEffect, useRef } from "react";

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
  Spin,
} from "antd";

import {
  WarningOutlined,
  DollarOutlined,
  CarOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

import axios from "axios";
import LineChart from "../charts/LineChart.jsx";

const { Title } = Typography;

const ViolationDashboard = ({ filters }) => {
  //------------------------------------
  // Dummy data
  // Replace with API aggregation later
  //------------------------------------
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = React.useState(false);

  const [chartData, setChartData] = useState({ categories: [], series: [] });

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

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/ViolationTrends`,
        );
        const rawData = response.data; // Array of { date, subroute, count }

        // 1. Extract all unique sorted dates for the X-Axis categories
        const uniqueDates = [
          ...new Set(rawData.map((item) => item.date)),
        ].sort();

        // 2. Identify all unique sub-routes (each gets its own line)
        const uniqueSubroutes = [
          ...new Set(rawData.map((item) => item.subroute)),
        ];

        const colorPalette = [
          "#2ecc71",
          "#e74c3c",
          "#3498db",
          "#f1c40f",
          "#9b59b6",
          "#e67e22",
        ];
        // 3. Map each sub-route into an ECharts series format
        const formattedSeries = uniqueSubroutes.map((subroute) => {
          // For every unique date on the timeline, find if this sub-route had data
          const dataPoints = uniqueDates.map((date) => {
            const found = rawData.find(
              (item) => item.date === date && item.subroute === subroute,
            );
            return found ? found.count : 0; // Default to 0 if no violations occurred on that day
          });

          return {
            name: subroute,
            type: "line",
            smooth: true,
            data: dataPoints,
          };
        });

        setChartData({
          categories: uniqueDates,
          series: formattedSeries,
        });
      } catch (error) {
        console.error("Failed to parse trend analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [backendURL]);

  return (
    <div>
      <Title level={3}>Violation Analytics</Title>
      <Divider />
      {/* ============   KPI CARDS =============== */}
      {/* ===     SUB-ROUTE TREND (ECharts LineChart) ============= */}

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

      {/* =========== MONTHLY TREND =========== */}

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

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <LineChart
            title="Sub-Route Violation Trends"
            subtitle="Real-time performance tracking per sub-route"
            categories={chartData.categories}
            series={chartData.series}
            loading={loading}
          />
        </Col>
      </Row>

      {/* ==============  RULE ANALYSIS ====================== */}

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

      {/* ========= ROUTE RISK ============ */}

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

      {/* =========== DRIVER RANKING ========== */}

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
