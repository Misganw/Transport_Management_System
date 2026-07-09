import React, { useState, useEffect, useRef } from "react";

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
  Spin,
  Empty,
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

import KPIWidget from "../charts/KPIWidget.jsx";
import StatisticCard from "../charts/StatisticCard.jsx";
import PieChart from "../charts/PieChart.jsx";
import BarChart from "../charts/BarChart.jsx";
import LineChart from "../charts/LineChart.jsx";
import AreaChart from "../charts/AreaChart.jsx";
import ProgressChart from "../charts/ProgressChart.jsx";
import axios from "axios";

const { Title } = Typography;

const OverviewDashboard = ({ filters }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(true);

  const defaultMetric = {
    count: 0,
    today: 0,
    yesterday: 0,
    trend: 0,
  };
  const [counts, setCounts] = useState({
    cars: { ...defaultMetric },
    drivers: { ...defaultMetric },
    passengers: { ...defaultMetric },
    programs: { ...defaultMetric },
    tickets: { ...defaultMetric },
    violations: { ...defaultMetric },
    employees: { ...defaultMetric },
    owners: { ...defaultMetric },
    payments: { ...defaultMetric },
    penalities: { ...defaultMetric },
    rules: { ...defaultMetric },
    tarrifs: { ...defaultMetric },
    traffic: { ...defaultMetric },
    revenue: { ...defaultMetric },
    routes: { ...defaultMetric },
    subroutes: { ...defaultMetric },
    users: { ...defaultMetric },
    activeVehicles: { ...defaultMetric },
    inactiveVehicles: { ...defaultMetric },
  });
  const [carTypes, setCarTypes] = useState({ categories: [], counts: [] });
  const [carTypesPieData, setCarTypesPieData] = useState([]);
  const [trendData, setTrendData] = useState({
    dates: [],
    penalties: [],
    tickets: [],
  });

  const [paidTickets, setPaidTickets] = useState(0);
  const [ticketAnalytics, setTicketAnalytics] = useState({
    daily: { total: 0, paid: 0 },
    weekly: { total: 0, paid: 0 },
    monthly: { total: 0, paid: 0 },
    yearly: { total: 0, paid: 0 },
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [topRoutes, setTopRoutes] = useState([]);

  const colorPalette = [
    "#3498db", // Blue (e.g., SUV)
    "#2ecc71", // Green (e.g., Sedan)
    "#e74c3c", // Red (e.g., Truck)
    "#f1c40f", // Yellow
    "#9b59b6", // Purple
    "#34495e", // Dark Grey
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = [
          { key: "cars", url: `${backendURL}/analytics/countCars` },
          { key: "drivers", url: `${backendURL}/analytics/countDrivers` },
          { key: "passengers", url: `${backendURL}/analytics/countPassengers` },
          { key: "programs", url: `${backendURL}/analytics/countPrograms` },
          { key: "tickets", url: `${backendURL}/analytics/countTickets` },
          { key: "violations", url: `${backendURL}/analytics/countViolations` },
          { key: "employees", url: `${backendURL}/analytics/countEmployees` },
          { key: "owners", url: `${backendURL}/analytics/countOwners` },
          { key: "payments", url: `${backendURL}/analytics/countPayments` },
          { key: "penalities", url: `${backendURL}/analytics/countPenalities` },
          { key: "rules", url: `${backendURL}/analytics/countRules` },
          { key: "tarrifs", url: `${backendURL}/analytics/countTarrifs` },
          { key: "traffic", url: `${backendURL}/analytics/countTraffic` },
          { key: "routes", url: `${backendURL}/analytics/countRoutes` },
          { key: "subroutes", url: `${backendURL}/analytics/countSubroutes` },
          { key: "users", url: `${backendURL}/analytics/countUsers` },
          { key: "revenue", url: `${backendURL}/analytics/revenue` },
        ];

        const countPromises = endpoints.map(async ({ key, url }) => {
          // const response = await axios.get(url);
          // return { key, count: response.data.count };
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
  }, []);

  useEffect(() => {
    const getCarByType = async () => {
      try {
        const response = await axios.get(`${backendURL}/analytics/carsByType`);
        const { byType, byLevel } = response.data; // This is your [{type: "SUV", count: 14}, ...]

        // 2. Map directly into two separate arrays
        const categories = byType.map((item) => item.type);
        const counts = byType.map((item) => item.count);

        const formattedPieData = byLevel.map((item) => ({
          name: item.level || "Unknown", // ECharts uses 'name' for labels
          value: item.count, // ECharts uses 'value' for sizing the slices
        }));

        // 3. Save both into your state object safely
        setCarTypes({ categories, counts });
        setCarTypesPieData(formattedPieData);
      } catch (error) {
        console.error("Error fetching car types:", error);
      } finally {
        setLoading(false);
      }
    };

    getCarByType();
  }, []);
  // if (loading) return <p>Loading chart...</p>;

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/paymentTrends`,
        );
        const rawTrends = response.data;

        // Extract individual structural arrays for Apache ECharts
        const dates = rawTrends.map((item) => item.date);
        const penalties = rawTrends.map((item) => item.penalties);
        const tickets = rawTrends.map((item) => item.tickets);

        setTrendData({ dates, penalties, tickets });
      } catch (error) {
        console.error("Error mapping collection trends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  useEffect(() => {
    const fetchPaidTickets = async () => {
      try {
        const response = await axios.get(`${backendURL}/analytics/paidTickets`);
        setPaidTickets(response.data.count);
      } catch (error) {
        console.error("Error fetching paid tickets:", error);
      }
    };

    fetchPaidTickets();
  }, []);

  useEffect(() => {
    const fetchTicketAnalytics = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/ticketPaymentAnalytics`,
        );
        setTicketAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching ticket analytics:", error);
      }
    };

    fetchTicketAnalytics();

    // // Set up an interval to fetch fresh data every 10 seconds
    // const intervalId = setInterval(fetchTicketAnalytics, 10000);
    // // CRITICAL: Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []);
  // console.log("Ticket Analytics:", ticketAnalytics);

  useEffect(() => {
    const fetchMonthlyPerformance = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/monthlyPerformanceOnTable`,
        );
        setMonthlyData(response.data);
      } catch (error) {
        console.error("Error fetching monthly performance data:", error);
      } finally {
        setTableLoading(false);
      }
    };

    fetchMonthlyPerformance();
  }, [backendURL]);

  useEffect(() => {
    const fetchTopRouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/analytics/topRoutes`);
        setTopRoutes(response.data);
      } catch (error) {
        console.error("Error fetching monthly performance data:", error);
      } finally {
        setTableLoading(false);
      }
    };
    fetchTopRouts();
  }, [backendURL]);

  if (loading) return <p>Loading Trends Chart...</p>;
  //--------------------------------
  // Summary KPI
  //--------------------------------

  const summary = {
    cars: counts.cars.count,
    drivers: counts.drivers.count,
    routes: counts.routes.count,
    subroutes: counts.subroutes.count,
    users: counts.users.count,
    tickets: counts.tickets.count,
    revenue: counts.revenue.count,
    violations: counts.violations.count,
    programs: counts.programs.count,
  };
  // console.log("Cars Trend: ", counts.cars.trend);
  // console.log("Drivers Trend: ", counts.drivers.trend);
  // console.log("routs Trend: ", counts.routes.trend);

  const performanceColumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Tickets",
      dataIndex: "tickets",
      key: "tickets",
      render: (v) => <strong>{v.toLocaleString()}</strong>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (v) => (
        <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
          {v.toLocaleString()} ETB
        </span>
      ),
    },
    {
      title: "Violations",
      dataIndex: "violations",
      key: "violations",
      render: (v) => (
        <span style={{ color: v > 0 ? "#e74c3c" : "inherit" }}>{v}</span>
      ),
    },
  ];

  const topRoutColumns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Tickets",
      dataIndex: "tickets",
      key: "tickets",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "Violations",
      dataIndex: "violations",
      key: "violations",
      render: (v) => (
        <Tag color={v > 5 ? "red" : v > 0 ? "orange" : "green"}>{v}</Tag>
      ),
    },
  ];
  return (
    <div>
      <Title level={3}>Transport Management Overview</Title>
      <Divider />

      {/* ==========  KPI CARDS ============== */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Total Cars"
            value={summary.cars}
            icon={<CarOutlined />}
            color="#1677ff"
            trend={counts.cars.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Drivers"
            value={summary.drivers}
            icon={<UserOutlined />}
            color="#1677ff"
            trend={counts.drivers.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Routes"
            value={summary.routes}
            icon={<EnvironmentOutlined />}
            color="#1677ff"
            trend={counts.routes.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="System Users"
            value={summary.users}
            icon={<TeamOutlined />}
            color="#1677ff"
            trend={counts.users.trend}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Tickets Sold"
            value={summary.tickets}
            icon={<QrcodeOutlined />}
            color="#1677ff"
            trend={counts.tickets.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Revenue"
            value={summary.revenue}
            icon={<DollarOutlined />}
            color="#1677ff"
            suffix="ETB"
            trend={counts.revenue.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Violations"
            value={summary.violations}
            icon={<WarningOutlined />}
            color="#1677ff"
            trend={counts.violations.trend}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Daily Programs"
            value={summary.programs}
            icon={<ScheduleOutlined />}
            color="#1677ff"
            trend={counts.programs.trend}
          />
        </Col>
      </Row>

      {/* =========  OPERATION STATUS   ================ */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24} lg={12}>
          <BarChart
            title="Vehicle Distribution"
            type="bar"
            categories={carTypes.categories}
            series={[
              {
                name: "",
                data: carTypes.counts,
                itemStyle: {
                  color: (params) => {
                    return colorPalette[params.dataIndex % colorPalette.length];
                  },
                },
              },
            ]}
          />
        </Col>

        <Col xs={24} lg={12}>
          {/* Pass the newly formatted data into your PieChart component */}
          <PieChart title="Vehicle Type Proportion" data={carTypesPieData} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <LineChart
            categories={trendData.dates} // X-axis string array
            series={[
              {
                name: "Ticket Payments",
                type: "line",
                data: trendData.tickets,
                smooth: true,
                itemStyle: { color: "#2ecc71" }, // Green line
              },
              {
                name: "Penalty Collections",
                type: "line",
                data: trendData.penalties,
                smooth: true,
                itemStyle: { color: "#e74c3c" }, // Red line
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <ProgressChart
            title="Ticket Payment Status"
            data={[
              {
                label: "Paid Tickets",
                value: paidTickets
                  ? Math.round((paidTickets / summary.tickets) * 100)
                  : 0,
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Ticket Payment Status Breakdown">
            <Row gutter={[32, 16]}>
              {Object.entries(ticketAnalytics).map(([key, value]) => {
                // Calculate conversion percentages dynamically
                const percentage = value.total
                  ? Math.round((value.paid / value.total) * 100)
                  : 0;

                return (
                  <Col xs={24} lg={12} key={key}>
                    <div
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        marginBottom: 6,
                      }}
                    >
                      {key} Performance
                    </div>
                    <Progress
                      type="line"
                      percent={percentage}
                      status={percentage === 100 ? "success" : "active"}
                    />
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                        marginTop: 4,
                      }}
                    >
                      {value.paid} paid / {value.total} total tickets
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* ===========  MONTHLY PERFORMANCE  ========== */}

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly Performance">
            {tableLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin tip="Calculating system analytics logs..." />
              </div>
            ) : monthlyData.length > 0 ? (
              <Table dataSource={monthlyData} columns={performanceColumns} />
            ) : (
              <Empty description="No transactions found for this company profile yet." />
            )}
          </Card>
        </Col>
      </Row>

      {/* ================ TOP ROUTES  ============== */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Top Performing Routes">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin tip="Parsing fleet telemetry performance profiles..." />
              </div>
            ) : topRoutes.length > 0 ? (
              <Table
                dataSource={topRoutes} // State hook array populated dynamically
                columns={topRoutColumns}
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <Empty description="No operational routes found under your active fleet registry profile." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewDashboard;
