import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Line, Pie, Column } from "@ant-design/charts";
import {
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const Analytics = () => {
  const lineData = [
    { month: "Jan", trips: 120 },
    { month: "Feb", trips: 150 },
    { month: "Mar", trips: 200 },
    { month: "Apr", trips: 170 },
    { month: "May", trips: 210 },
    { month: "Jun", trips: 250 },
  ];

  const pieData = [
    { type: "Passenger", value: 45 },
    { type: "Cargo", value: 30 },
    { type: "Delivery", value: 25 },
  ];

  const columnData = [
    { month: "Jan", revenue: 1000 },
    { month: "Feb", revenue: 1400 },
    { month: "Mar", revenue: 1800 },
    { month: "Apr", revenue: 1600 },
  ];

  const lineConfig = {
    data: lineData,
    xField: "month",
    yField: "trips",
    smooth: true,
    point: { size: 4 },
    height: 260,
  };

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    position: "outside",
    interactions: [{ type: "element-active" }],
    height: 260,
  };

  const columnConfig = {
    data: columnData,
    xField: "month",
    yField: "revenue",
    color: "#1890ff",
    height: 260,
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Drivers"
              value={128}
              prefix={<UserOutlined />}
              suffix="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Vehicles"
              value={53}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={12500}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth Rate"
              value={12.4}
              precision={1}
              prefix={<ArrowUpOutlined style={{ color: "green" }} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Trips Overview">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Service Distribution">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Revenue Analysis">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
