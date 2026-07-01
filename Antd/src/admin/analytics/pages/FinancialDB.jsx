import React from "react";

import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Typography,
  Divider,
} from "antd";

import {
  DollarOutlined,
  RiseOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const FinanceDashboard = () => {
  const finance = {
    today: 85000,

    month: 2400000,

    year: 28500000,

    penalty: 560000,
  };

  const revenue = [
    {
      key: 1,
      month: "January",
      amount: 320000,
    },

    {
      key: 2,
      month: "February",
      amount: 410000,
    },

    {
      key: 3,
      month: "March",
      amount: 520000,
    },
  ];

  return (
    <div>
      <Title level={3}>Financial Analytics</Title>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Today Revenue"
              value={finance.today}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={finance.month}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Yearly Revenue"
              value={finance.year}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Penalty Revenue" value={finance.penalty} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly Revenue">
            <Table
              dataSource={revenue}
              columns={[
                {
                  title: "Month",
                  dataIndex: "month",
                },

                {
                  title: "Revenue",
                  dataIndex: "amount",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Revenue Collection Progress">
            <Progress percent={82} status="active" />

            <p>Collected revenue compared with expected revenue</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceDashboard;
