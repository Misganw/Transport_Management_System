import React from "react";

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

const { Title } = Typography;

const TicketDashboard = ({ filters }) => {
  const data = {
    tickets: 32500,
    paid: 28000,
    reserved: 3200,
    cancelled: 1300,
    revenue: 2450000,
  };

  const payments = [
    {
      key: 1,
      method: "Telebirr",
      amount: 850000,
    },

    {
      key: 2,
      method: "Bank",
      amount: 700000,
    },

    {
      key: 3,
      method: "Cash",
      amount: 900000,
    },
  ];

  return (
    <div>
      <Title level={3}>Ticket Analytics</Title>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={data.tickets}
              prefix={<QrcodeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Paid Tickets"
              value={data.paid}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Cancelled"
              value={data.cancelled}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={data.revenue}
              prefix={<MoneyCollectOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Ticket Status">
            <p>Paid</p>

            <Progress percent={86} />

            <p>Reserved</p>

            <Progress percent={10} />

            <p>Cancelled</p>

            <Progress percent={4} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Payment Methods">
            <Table
              dataSource={payments}
              columns={[
                {
                  title: "Method",
                  dataIndex: "method",
                },

                {
                  title: "Amount",
                  dataIndex: "amount",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TicketDashboard;
