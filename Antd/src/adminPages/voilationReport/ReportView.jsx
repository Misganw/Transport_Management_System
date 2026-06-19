import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Tag,
  QRCode,
  Button,
} from "antd";
import "./printPenality.css";
import logo from "../../assets/logo_circle.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const { Title, Text } = Typography;

export default function PaymentReceipt() {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL; // e.g., http://localhost:5000
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/adminDashboard"); // change path if yours is different
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/voilationReports/report_view/${reportId}`,
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadReport();
  }, [reportId]);
  if (!data) {
    return <div>Loading Report...</div>;
  }

  const printReceipt = () => {
    window.print();
  };

  const downloadPDF = async () => {
    const receipt = document.getElementById("payment_receipt");

    if (!receipt) return;

    try {
      const canvas = await html2canvas(receipt, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pageWidth;

      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save(
        `Receipt-${data.paymentCode || data.ticketCode || Date.now()}.pdf`,
      );
    } catch (err) {
      console.error("PDF Export Error", err);
    }
  };

  if (!data)
    return (
      <Result
        status="error"
        title="Data Not Found"
        subTitle="Cannot find your ticket details."
      />
    );

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
      description: "Violation  Report",
      amount: `${data.reportedByInfo}`,
    },
  ];

  return (
    <>
      <div
        id="payment_receipt"
        style={{
          padding: 30,
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
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
                <Title level={2}>Voilation Report</Title>

                <Text strong>{data.companyInfo}</Text>
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

            <Row gutter={30}>
              <Col span={12}>
                <Title level={5}>Reporter Information</Title>
                <div>Reporter Name: {data.officerInfo}</div>
                <div>Email: {data.officerEmail}</div>

                <div>Phone: {data.officerPhone}</div>
              </Col>

              <Col span={12}>
                <Title level={5}>Driver Information</Title>

                <div>Code: {data.driverInfo}</div>

                <div>
                  Status: <Tag color="green">{data.statusInfo}</Tag>
                </div>

                <div>Route: {data.routeInfo}</div>
              </Col>
            </Row>

            <Divider />

            {/* Summary Boxes */}
            <Row gutter={10}>
              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Reporter</Text>

                  <Title level={4}>{data.reportedByInfo}</Title>
                </Card>
              </Col>

              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Sub Rout</Text>

                  <Title level={4}>{data.subroutInfo}</Title>
                </Card>
              </Col>

              <Col span={6}>
                <Card size="small">
                  <Text type="secondary">Route</Text>

                  <Title level={5}>{data.carInfo}</Title>
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
                  <Text style={{ color: "#fff" }}>Voilated Rule</Text>

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
            <Table
              columns={columns}
              dataSource={datasource}
              pagination={false}
            />
          </Card>
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Button type="primary" onClick={printReceipt}>
          Print Report
        </Button>

        <Button onClick={downloadPDF}>Download PDF</Button>

        <Button onClick={goToDashboard}>Back To Dashboard</Button>
      </div>
    </>
  );
}
