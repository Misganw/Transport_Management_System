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
} from "antd";

import {
  CarOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import KPIWidget from "../charts/KPIWidget.jsx";
import StatisticCard from "../charts/StatisticCard.jsx";
import PieChart from "../charts/PieChart.jsx";
import BarChart from "../charts/BarChart.jsx";
import LineChart from "../charts/LineChart.jsx";
import AreaChart from "../charts/AreaChart.jsx";
import ProgressChart from "../charts/ProgressChart.jsx";
import StatisticalChart from "../charts/StatisticalChart.jsx";
import axios from "axios";

const { Title } = Typography;

const FleetDashboard = ({ filters }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [carLevel, setCarLevel] = useState([]);
  const [carbyAvtiveProgram, setcarbyAvtiveProgram] = useState();
  const [carTypeCountByActiveProgram, setcarTypeCountByActiveProgram] =
    useState({ categories: [], count: [] });

  const [counts, setCounts] = useState({
    cars: 0,
    drivers: 0,
    owners: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
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
          { key: "programs", url: `${backendURL}/analytics/countPrograms` },
          { key: "owners", url: `${backendURL}/analytics/countOwners` },
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

        const formatByTypeData = byType.map((item) => ({
          type: item.type,
          count: item.count,
        }));

        // 3. Save both into your state object safely
        // setCars({ categories, counts });
        setCars(formatByTypeData);
        setCarLevel(formattedPieData);
      } catch (error) {
        console.error("Error fetching car types:", error);
      } finally {
        setLoading(false);
      }
    };

    getCarByType();
  }, []);
  // console.log("Care data:", cars);
  useEffect(() => {
    const getcountCarByActiveProgram = async () => {
      try {
        setLoading(true);
        const countCarByActiveProgram = await axios.get(
          `${backendURL}/analytics/countCarsByActiveProgram`,
        );

        setcarbyAvtiveProgram(countCarByActiveProgram.data.count);
      } catch (error) {
        console.error("Can't count Cars by Active program", error);
      } finally {
        setLoading(false);
      }
    };
    getcountCarByActiveProgram();
  }, [backendURL]);

  useEffect(() => {
    const getcarTypeCountByActiveProgram = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/analytics/carTypeCountByActiveProgram`,
        );
        const formatData = response.data;
        const categories = formatData.map((item) => item.type);
        const count = formatData.map((item) => item.count);
        setcarTypeCountByActiveProgram({ categories, count });

        console.log(carTypeCountByActiveProgram);
      } catch (error) {
        console.error("Can not get car type count by active program", error);
      } finally {
        setLoading(false);
      }
    };
    getcarTypeCountByActiveProgram();
  }, [backendURL]);

  if (loading) return <p>Loading chart...</p>;

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
          <KPIWidget
            title="Total Cars"
            value={counts.cars}
            icon={<CarOutlined />}
            color="#1677ff"
          />
        </Col>

        <Col xs={24} md={6}>
          <KPIWidget
            title="Drivers"
            value={counts.drivers}
            icon={<UserOutlined />}
            color="#1677ff"
          />
        </Col>

        <Col xs={24} md={6}>
          <KPIWidget
            title="Owners"
            value={counts.owners}
            icon={<TeamOutlined />}
            color="#1677ff"
          />
        </Col>

        <Col xs={24} md={6}>
          <KPIWidget
            title="Active Cars"
            value={counts.activeVehicles}
            icon={<ToolOutlined />}
            color="#1677ff"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <Card title="Car Type Distribution">
            {carLevel.map((item, index) => {
              // Calculate the percentage safely, rounding it to look cleaner
              const percentage = counts.cars
                ? Math.round((item.value / counts.cars) * 100)
                : 0;

              return (
                <div key={item.name || index} style={{ marginBottom: 12 }}>
                  <p style={{ marginBottom: 4 }}>{item.name}</p>
                  <Progress percent={percentage} />
                </div>
              );
            })}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Today's Cars on Active Programs">
            <Progress
              type="circle"
              percent={Math.round((carbyAvtiveProgram / counts.cars) * 100)}
            />
            <p>
              Active vehicles compared with total -{carbyAvtiveProgram}- cars
            </p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={16}>
          <Card title=" Today's Active Cars Distribution by Vehicle Type">
            <BarChart
              type="bar"
              categories={carTypeCountByActiveProgram.categories}
              series={[
                {
                  name: "",
                  data: carTypeCountByActiveProgram.count.map((value) =>
                    counts.cars > 0 ? value : 0,
                  ),
                  itemStyle: {
                    color: (params) => {
                      return colorPalette[
                        params.dataIndex % colorPalette.length
                      ];
                    },
                  },
                },
              ]}
            />
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
