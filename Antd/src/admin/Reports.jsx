import React from "react";
import { Card, Row, Col, Table, Statistic } from "antd";
import { Area, Column, Pie, Line } from "@ant-design/charts";
import {
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const Reports = () => {
  // 🔹 Dummy dataset examples — you can later fetch real data from backend
  const revenueTrend = [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 650 },
    { month: "Mar", value: 900 },
    { month: "Apr", value: 780 },
    { month: "May", value: 1050 },
    { month: "Jun", value: 1200 },
  ];

  const tripData = [
    { key: 1, driver: "John Doe", vehicle: "Bus 12", trips: 25, revenue: 450 },
    {
      key: 2,
      driver: "Sara Ali",
      vehicle: "Truck 07",
      trips: 15,
      revenue: 380,
    },
    {
      key: 3,
      driver: "Mark Tesh",
      vehicle: "Taxi 03",
      trips: 20,
      revenue: 520,
    },
  ];

  const vehicleUtilization = [
    { vehicle: "Bus", utilization: 85 },
    { vehicle: "Truck", utilization: 60 },
    { vehicle: "Taxi", utilization: 72 },
    { vehicle: "Van", utilization: 55 },
  ];

  const topRoutes = [
    { route: "Addis - Adama", passengers: 420 },
    { route: "Addis - Bahir Dar", passengers: 320 },
    { route: "Addis - Hawassa", passengers: 210 },
  ];

  const tripColumns = [
    { title: "Driver", dataIndex: "driver", key: "driver" },
    { title: "Vehicle", dataIndex: "vehicle", key: "vehicle" },
    { title: "Trips", dataIndex: "trips", key: "trips" },
    { title: "Revenue (USD)", dataIndex: "revenue", key: "revenue" },
  ];

  // 🔹 Chart configurations
  const areaConfig = {
    data: revenueTrend,
    xField: "month",
    yField: "value",
    smooth: true,
    height: 260,
    color: "#1890ff",
    areaStyle: { fill: "rgba(24,144,255,0.2)" },
  };

  const columnConfig = {
    data: tripData,
    xField: "driver",
    yField: "revenue",
    color: "#52c41a",
    height: 260,
  };

  const utilizationConfig = {
    data: vehicleUtilization,
    xField: "vehicle",
    yField: "utilization",
    color: "#faad14",
    height: 260,
  };

  const pieConfig = {
    data: topRoutes,
    angleField: "passengers",
    colorField: "route",
    radius: 0.9,
    label: { type: "outer", content: "{name}" },
    interactions: [{ type: "element-active" }],
    height: 260,
  };

  const lineConfig = {
    data: revenueTrend,
    xField: "month",
    yField: "value",
    smooth: true,
    height: 260,
    color: "#722ed1",
    point: { size: 4, shape: "circle" },
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 🔸 Summary Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Trips"
              value={580}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Drivers"
              value={48}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={14500}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth"
              value={8.4}
              precision={1}
              prefix={<ArrowUpOutlined style={{ color: "green" }} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 🔸 Revenue charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue Trend">
            <Area {...areaConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue by Driver">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      {/* 🔸 Vehicle & Route charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Vehicle Utilization Rate">
            <Column {...utilizationConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top Performing Routes">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* 🔸 Advanced trend or KPI chart */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Operational Efficiency Trend">
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>

      {/* 🔸 Report Table */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Trip Performance Report">
            <Table
              columns={tripColumns}
              dataSource={tripData}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
