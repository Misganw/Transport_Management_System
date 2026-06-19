import React from "react";
import { Card, Row, Col, Typography, Divider, Table, Tag } from "antd";
import "./receiptCSS.css";
import logo from "../../assets/logo_circle.png";
const { Title, Text } = Typography;

export default function PaymentReceipt({ data, paymentType }) {
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
    },
  ];

  const datasource = [
    {
      key: 1,
      description:
        paymentType === "ticket"
          ? "Transport Ticket Payment"
          : "Violation Penalty Payment",
      amount: `$${data.amount || data.paidAmount}`,
    },
  ];

  return (
    <div id="receipt">
      <Card
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        {/* Header */}
        <Row justify="space-between">
          <Col>
            <Title level={2}>PAYMENT RECEIPT</Title>

            <Text strong>{data.companyName}</Text>
          </Col>

          <Col>
            <img
              src={logo}
              alt="logo"
              style={{
                width: 120,
              }}
            />
          </Col>
        </Row>

        <Divider />

        {/* Customer + Receipt */}
        <Row gutter={30}>
          <Col span={12}>
            <Title level={5}>Customer Information</Title>
            <div>
              Customer Name:{" "}
              {paymentType === "ticket"
                ? data.passengerName
                : data.driverInfo || "N/A"}
            </div>
            <div>Email: {data.email}</div>

            <div>Phone: {data.phone}</div>
          </Col>

          <Col span={12}>
            <Title level={5}>Receipt Information</Title>

            <div>
              Code:{" "}
              {paymentType === "penality"
                ? data.paymentCode
                : data.reservationCode}
            </div>

            <div>
              Status:{" "}
              <Tag color="green">
                {paymentType === "penality" ? data.status : data.paymentStatus}
              </Tag>
            </div>

            <div>Route: {data.route}</div>
          </Col>
        </Row>

        <Divider />

        {/* Summary Boxes */}
        <Row gutter={10}>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Payment Code</Text>

              <Title level={4}>
                {paymentType === "penality"
                  ? data.paymentCode
                  : data.reservationCode}
              </Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Status</Text>

              <Title level={4}>
                {paymentType === "penality" ? data.status : data.paymentStatus}
              </Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Route</Text>

              <Title level={5}>{data.route}</Title>
            </Card>
          </Col>

          <Col span={6}>
            <Card
              size="small"
              style={{
                background: "#001529",
                color: "#fff",
              }}
            >
              <Text style={{ color: "#fff" }}>Total Amount</Text>

              <Title
                level={3}
                style={{
                  color: "#fff",
                }}
              >
                ${data.amount || data.paidAmount}
              </Title>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Detail Table */}
        <Table columns={columns} dataSource={datasource} pagination={false} />

        {/* Payment Info */}
        {data.payments?.map((p) => (
          <div
            key={p.providerPaymentId}
            style={{
              marginTop: 20,
            }}
          >
            <Divider />

            <Row>
              <Col span={12}>
                <Text strong>Payment Method:</Text> {p.provider.toUpperCase()}
              </Col>

              <Col span={12}>
                <Text strong>Amount:</Text> {p.amount} {p.currency}
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Text strong>Transaction ID:</Text> {p.providerPaymentId}
              </Col>
              <Col span={12}>
                <Text strong>Paid At:</Text>{" "}
                {new Date(p.paidAt).toLocaleString()}
              </Col>
            </Row>
          </div>
        ))}
      </Card>
    </div>
  );
}
