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

import KPIWidget from "../charts/KPIWidget.jsx";
import StatisticCard from "../charts/StatisticCard.jsx";
import PieChart from "../charts/PieChart.jsx";
import BarChart from "../charts/BarChart.jsx";
import LineChart from "../charts/LineChart.jsx";
import AreaChart from "../charts/AreaChart.jsx";
import ProgressChart from "../charts/ProgressChart.jsx";
import axios from "axios";

const { Title } = Typography;

const ViolationDashboard = ({ filters }) => {
  //------------------------------------
  // Dummy data
  // Replace with API aggregation later
  //------------------------------------
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = React.useState(false);

  const [chartData, setChartData] = useState({ categories: [], series: [] });

  const defaultMetric = {
    count: 0,
    today: 0,
    yesterday: 0,
    trend: 0,
  };
  const [counts, setCounts] = useState({
    drivers: { ...defaultMetric },
    programs: { ...defaultMetric },
    payments: { ...defaultMetric },
    penality: { ...defaultMetric },
    revenue: { ...defaultMetric },
    violation: { ...defaultMetric },
  });

  const [penalityRevenue, setpenalityRevenue] = useState(0);
  const [cancelledTicket, setcancelledTicket] = useState(0);

  const [revenueByMethod, setrevenueByMethod] = useState([]);
  const [violationTrend, setviolationTrend] = useState({
    categories: [],
    series: [],
  });
  const [countViolation, setcountViolation] = useState([]);
  const [countViolationByRoute, setcountViolationByRoute] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = [
          { key: "drivers", url: `${backendURL}/analytics/countDrivers` },
          { key: "programs", url: `${backendURL}/analytics/countPrograms` },
          { key: "payments", url: `${backendURL}/analytics/countPayments` },
          { key: "revenue", url: `${backendURL}/analytics/revenue` },
          { key: "violation", url: `${backendURL}/analytics/countViolations` },
          { key: "penality", url: `${backendURL}/analytics/countPenalities` },
        ];

        const countPromises = endpoints.map(async ({ key, url }) => {
          const { data } = await axios.get(url);

          return {
            key,
            metric: {
              count: data.count ?? 0,
              today: data.today ?? 0,
              yesterday: data.yesterday ?? 0,
              trend: data.trend ?? 0,
            },
          };
        });

        const results = await Promise.all(countPromises);
        const newCounts = results.reduce((acc, { key, metric }) => {
          acc[key] = metric;
          return acc;
        }, {});

        setCounts(newCounts);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [backendURL]);

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

  useEffect(() => {
    const violationTrend = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/violationTrend`,
        );
        const rawData = response.data; // Array of { date, subroute, count }

        const uniqueDates = [
          ...new Set(rawData.map((item) => item.date)),
        ].sort();
        const uniqueSubroutes = [
          ...new Set(rawData.map((item) => item.violatedRules)),
        ];

        const formattedSeries = uniqueSubroutes.map((violationTrend) => {
          // For every unique date on the timeline, find if this sub-route had data
          const dataPoints = uniqueDates.map((date) => {
            const found = rawData.find(
              (item) =>
                item.date === date && item.violatedRules === violationTrend,
            );
            return found ? found.count : 0; // Default to 0 if no violations occurred on that day
          });

          return {
            name: violationTrend,
            type: "line",
            smooth: true,
            data: dataPoints,
          };
        });

        setviolationTrend({
          categories: uniqueDates,
          series: formattedSeries,
        });
      } catch (error) {
        console.error("Failed to parse trend analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    violationTrend();
  }, [backendURL]);

  useEffect(() => {
    const countViolation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/countViolation`,
        );
        setcountViolation(response.data);
      } catch (error) {
        console.error("violation not found", error);
      } finally {
        setLoading(false);
      }
    };
    countViolation();
  }, [backendURL]);

  useEffect(() => {
    const countViolationByRoute = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/countViolationByRoute`,
        );
        setcountViolationByRoute(response.data);
      } catch (error) {
        console.error("violation not found", error);
      } finally {
        setLoading(false);
      }
    };
    countViolationByRoute();
  }, [backendURL]);

  const KPIData = {
    drivers: counts.drivers.count,
    revenue: counts.revenue.count,
    programs: counts.programs.count,
    violation: counts.violation.count,
    penality: counts.penality.count,
  };

  const summary = {
    totalReports: 850,
    punishedDrivers: 230,
    totalPenalty: 560000,
    paidPenalty: 420000,
  };

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

  const colorPalette = [
    "#2ecc71",
    "#e74c3c",
    "#3498db",
    "#f1c40f",
    "#9b59b6",
    "#e67e22",
  ];

  const ruleColumns = [
    {
      title: "Violted Rules",
      dataIndex: "violatedRules",
      key: "_id",
    },

    {
      title: "Total Violation",
      dataIndex: "count",
      key: "count",
    },
  ];

  const violationByRoutColumns = [
    {
      title: "Routes",
      dataIndex: "route",
    },

    {
      title: "Total Violation",
      dataIndex: "count",
    },
    {
      title: "Risk",
      dataIndex: "risk",
      render: (risk) => (
        <Tag
          color={
            risk === "High" ? "red" : risk === "Medium" ? "orange" : "green"
          }
        >
          {risk}
        </Tag>
      ),
    },
  ];

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
              value={KPIData.violation}
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

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <LineChart
            title="Violation Trends by rule types"
            subtitle=""
            categories={violationTrend.categories}
            series={violationTrend.series}
            loading={loading}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <LineChart
            title="Violation Trends by Sub-routes"
            subtitle=""
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
              dataSource={countViolation}
              columns={ruleColumns}
              rowKey="_id"
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
              dataSource={countViolationByRoute}
              columns={[...violationByRoutColumns]}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViolationDashboard;
