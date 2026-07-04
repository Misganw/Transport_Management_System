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
import axios from "axios";

const { Title } = Typography;

const OverviewDashboard = ({ filters }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    cars: 0,
    drivers: 0,
    passengers: 0,
    programs: 0,
    tickets: 0,
    violations: 0,
    employees: 0,
    owners: 0,
    payments: 0,
    penalities: 0,
    rules: 0,
    tarrifs: 0,
    traffic: 0,
    revenue: 0,
    routes: 0,
    subroutes: 0,
    users: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
  });
  const [carTypes, setCarTypes] = useState({ categories: [], counts: [] });
  const [carTypesPieData, setCarTypesPieData] = useState([]);
  const [trendData, setTrendData] = useState({
    dates: [],
    penalties: [],
    tickets: [],
  });

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
          const response = await axios.get(url);
          return { key, count: response.data.count };
        });

        const results = await Promise.all(countPromises);
        const newCounts = results.reduce((acc, { key, count }) => {
          acc[key] = count;
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

  if (loading) return <p>Loading Trends Chart...</p>;
  //--------------------------------
  // Summary KPI
  //--------------------------------

  const summary = {
    cars: counts.cars,
    drivers: counts.drivers,
    routes: counts.routes,
    subroutes: counts.subroutes,
    users: counts.users,
    tickets: counts.tickets,
    revenue: counts.revenue,
    violations: counts.violations,
    programs: counts.programs,
    activeVehicles: counts.activeVehicles,
    inactiveVehicles: counts.inactiveVehicles,
  };
  // console.log("Summary data:", summary);
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
          <KPIWidget
            title="Total Cars"
            value={summary.cars}
            icon={<CarOutlined />}
            color="#1677ff"
            trend={8}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Drivers"
            value={summary.drivers}
            icon={<UserOutlined />}
            color="#1677ff"
            trend={5}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Routes"
            value={summary.routes}
            icon={<EnvironmentOutlined />}
            color="#1677ff"
            trend={3}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="System Users"
            value={summary.users}
            icon={<TeamOutlined />}
            color="#1677ff"
            trend={10}
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
            trend={15}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Revenue"
            value={summary.revenue}
            icon={<DollarOutlined />}
            color="#1677ff"
            suffix="ETB"
            trend={12}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Violations"
            value={summary.violations}
            icon={<WarningOutlined />}
            color="#1677ff"
            trend={-5}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPIWidget
            title="Daily Programs"
            value={summary.programs}
            icon={<ScheduleOutlined />}
            color="#1677ff"
            trend={7}
          />
        </Col>
      </Row>

      {/* =========  OPERATION STATUS   ================ */}

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24} lg={12}>
          <BarChart
            title="Vehicle Status"
            type="bar"
            categories={carTypes.categories}
            series={[
              {
                name: "cars",
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
          <Card title="Ticket Payment Status">
            <Progress percent={86} status="active" />

            <p>Paid tickets percentage</p>
          </Card>
        </Col>
      </Row>

      {/* ===========  MONTHLY PERFORMANCE  ========== */}

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

      {/* ================ TOP ROUTES  ============== */}

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
