import React, { useState, useEffect, useRef } from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Typography,
  Divider,
} from "antd";

import {
  QrcodeOutlined,
  MoneyCollectOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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

const TicketDashboard = ({ filters }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [getByPStatus, setgetByPStatus] = useState([]);

  const defaultMetric = {
    count: 0,
    today: 0,
    yesterday: 0,
    trend: 0,
  };
  const [counts, setCounts] = useState({
    drivers: { ...defaultMetric },
    passengers: { ...defaultMetric },
    programs: { ...defaultMetric },
    tickets: { ...defaultMetric },
    payments: { ...defaultMetric },
    penalities: { ...defaultMetric },
    revenue: { ...defaultMetric },
  });

  const [ticketRevenue, setticketRevenue] = useState(0);
  const [cancelledTicket, setcancelledTicket] = useState(0);
  const [TicketPaymentTrend, setTicketPaymentTrend] = useState({
    categories: [],
    series: [],
  });

  const [revenueByMethod, setrevenueByMethod] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = [
          { key: "drivers", url: `${backendURL}/analytics/countDrivers` },
          { key: "passengers", url: `${backendURL}/analytics/countPassengers` },
          { key: "programs", url: `${backendURL}/analytics/countPrograms` },
          { key: "tickets", url: `${backendURL}/analytics/countTickets` },
          { key: "payments", url: `${backendURL}/analytics/countPayments` },
          { key: "revenue", url: `${backendURL}/analytics/revenue` },
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
    const getTicketByStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/getTicketByPaymentStatus`,
        );
        const fetchData = response.data;
        const formatByTypeData = fetchData.map((item) => ({
          status: item.status,
          count: item.count,
        }));
        setgetByPStatus(formatByTypeData);
      } catch (error) {
        console.error("Error fetching Ticke by payment Status:", error);
      } finally {
        setLoading(false);
      }
    };
    getTicketByStatus();
  }, [backendURL]);

  useEffect(() => {
    const getTotalTicketRevenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/getTicketRevenu`,
        );
        setticketRevenue(response.data);
      } catch (error) {
        console.error("Total Ticket revenue not found", error);
      } finally {
        setLoading(false);
      }
    };
    getTotalTicketRevenu();
  }, [backendURL]);

  useEffect(() => {
    const getTotalCancelledTicket = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/getTotalCancelledTicket`,
        );
        setcancelledTicket(response.data);
      } catch (error) {
        console.error("Do not get total cancelled ticket", error);
      } finally {
        setLoading(false);
      }
    };
    getTotalCancelledTicket();
  }, [backendURL]);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/analytics/getTicketPaymentTrend`,
        );
        const rawData = response.data; // Array of { date, method, totalAmount }

        // 1. Extract all unique sorted dates for the X-Axis categories
        const uniqueDates = [
          ...new Set(rawData.map((item) => item.date)),
        ].sort();

        // 2. Identify all unique pament (each gets its own line)
        const uniquePayment = [...new Set(rawData.map((item) => item.methods))];
        // console.log(uniquePayment);
        // 3. Map each payment into an ECharts series format
        const formattedSeries = uniquePayment.map((payment) => {
          // For every unique date on the timeline, find if this sub-route had data
          const dataPoints = uniqueDates.map((date) => {
            const found = rawData.find(
              (item) => item.date === date && item.methods === payment,
            );
            return {
              value: found ? found.totalRevenue : 0,
              count: found ? found.count : 0,
            }; // Default to 0 if no violations occurred on that day
          });

          return {
            name: payment,
            type: "line",
            smooth: true,
            data: dataPoints,
          };
        });

        setTicketPaymentTrend({
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
    const getRevenueByMethod = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/revenueByMethods`,
        );
        setrevenueByMethod(response.data);
      } catch (error) {
        console.error("Ticket not found", error);
      } finally {
        setLoading(false);
      }
    };
    getRevenueByMethod();
  }, [backendURL]);

  if (loading) return <p>Loading chart...</p>;

  const colorPalette = [
    "#3498db", // Blue (e.g., SUV)
    "#2ecc71", // Green (e.g., Sedan)
    "#e74c3c", // Red (e.g., Truck)
    "#f1c40f", // Yellow
    "#9b59b6", // Purple
    "#34495e", // Dark Grey
  ];

  const data = {
    tickets: 32500,
    paid: 28000,
    reserved: 3200,
    cancelled: 1300,
    revenue: 2450000,
  };
  const dataColumn = [
    {
      title: "Method",
      dataIndex: "methods",
    },

    {
      title: "Amount",
      dataIndex: "totalRevenue",
    },
    {
      title: "No# of Tickets",
      dataIndex: "count",
    },
  ];

  const summary = {
    drivers: counts.drivers.count,
    tickets: counts.tickets.count,
    revenue: counts.revenue.count,
    programs: counts.programs.count,
  };

  return (
    <div>
      <Title level={3}>Ticket Analytics</Title>

      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={summary.tickets}
              prefix={<QrcodeOutlined />}
            />
          </Card>
        </Col>
        {getByPStatus.map((item, index) => {
          if (item.status === "paid") {
            return (
              <Col xs={24} md={6} key={`paid-${item.status || index}`}>
                <Card>
                  <Statistic
                    title="Paid Tickets"
                    value={item.count}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            );
          } else {
            return (
              <Col xs={24} md={6} key={`paid-${item.status || index}`}>
                <Card>
                  <Statistic
                    title="Paid"
                    value={0}
                    prefix={<CloseCircleOutlined />}
                  />
                </Card>
              </Col>
            );
          }
        })}
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Cancelled"
              value={cancelledTicket}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={ticketRevenue}
              prefix={<MoneyCollectOutlined />}
            />
          </Card>
        </Col>
        ;
      </Row>

      <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Hourly Ticket status Distribution">
            {getByPStatus.map((item, index) => {
              // Calculate the percentage safely, rounding it to look cleaner
              const percentage = counts.tickets
                ? Math.round((item.count / counts.tickets) * 100)
                : 0;

              return (
                <div key={item.status || index} style={{ marginBottom: 12 }}>
                  <p style={{ marginBottom: 4 }}>{item.status}</p>
                  <Progress percent={percentage} />
                </div>
              );
            })}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Payment Methods">
            <Table
              dataSource={revenueByMethod}
              columns={dataColumn}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <LineChart
            title="Ticket PaymentTrends"
            subtitle="Real-time performance tracking per paid ticket"
            categories={TicketPaymentTrend.categories}
            series={TicketPaymentTrend.series}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TicketDashboard;
