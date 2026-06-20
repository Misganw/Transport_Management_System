import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
  ConfigProvider,
  Select,
  Row,
  Col,
  Card,
} from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { toast } from "react-toastify";
import {
  DollarOutlined,
  PrinterOutlined,
  DownloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { ticketService } from "../../admin/common/makeServices";
import { penalityServices } from "../../admin/common/makeServices";
import axios from "axios";
import "../../admin/css/AdminPage.css";
import "../../admin/css/TableCSS.css";
// import PrintablePenality from "./PrintablePenality.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AppContext } from "../../context/AppContext.jsx";

import telebirr from "../../assets/paymentImage/telebirr.png";
import chapa from "../../assets/paymentImage/chap.png";
import cbebirr from "../../assets/paymentImage/cbebirr.jpg";
import stripe from "../../assets/paymentImage/stripe.png";
import mpesa from "../../assets/paymentImage/mpesa.png";
import mastercard from "../../assets/paymentImage/mastercard.png";
import paypal from "../../assets/paymentImage/paypal.png";
// ..... end of import .....

dayjs.extend(duration);

export default function PenalityTable({ reportId }) {
  const [penality, setPenality] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, forceTick] = useState(0); // for countdown refresh
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [printPenality, setPrintPenality] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPenalityId, setSelectedPenalityId] = useState(null);
  const [provider, setProvider] = useState(null);

  /* ---------------- Pay Modal  ---------------- */
  const openPaymentModal = (penalityId) => {
    setSelectedPenalityId(penalityId);
    setProvider(null);
    setPaymentModalOpen(true);
  };

  /* ---------------- FETCH Penality ---------------- */
  const fetchPenality = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendURL}/getPenalityByReport/${reportId}`,
      );
      // ALWAYS make sure it's an array
      const data = Array.isArray(res.data) ? res.data : [];
      const transformed = data.map((p) => ({
        ...p,
        car: `${p.reportId?.ticketId?.programId?.carId?.type || "-"} - ${p.reportId?.ticketId?.programId?.carId?.level || "-"}|${p.reportId?.ticketId?.programId?.carId?.plateNumber || "-"}`,
        setby: p.userId?.name || "-",
        license: `${p.driverId || "-"}`,
        amount: `${p.amount || 0}`,
      }));

      setPenality(transformed);

      // console.log("Fetched penality:", data);
    } catch (err) {
      setPenality([]);
      console.error("Failed to load penality", err);
      toast.error(err.response?.data?.message || "Failed to load penality");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchPenality();
  }, [reportId]);

  /* ---------------- COUNTDOWN REFRESH ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      forceTick((t) => t + 1);
    }, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  // const canceleTicket = async (ticketId) => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`${backendURL}/cancelTicket/${ticketId}`);
  //     fetchTickets(); // Refresh the ticket list after deletion
  //   } catch (err) {
  //     // toast.error("Failed to cancel ticket: " + err.message);
  //     toast.error(err.response?.data?.message || "Failed to cancel ticket");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /* ---------------- HELPERS ---------------- */
  const renderStatus = (status) => {
    const colors = {
      opened: "blue",
      pending: "orange",
      paid: "green",
      canceled: "red",
    };
    return (
      <Tag color={colors[status]} style={{ border: "none" }}>
        {status.toLowerCase()}
      </Tag>
    );
  };

  const timeLeft = (ticket) => {
    if (!ticket.createdAt) return "-";
    // expiry = createdAt + 1 hour
    const expiresAt = dayjs(ticket.createdAt).add(1, "hour");
    const diff = expiresAt.diff(dayjs());
    if (diff <= 0) return "Expired";
    const d = dayjs.duration(diff);
    return `${d.minutes()}m ${d.seconds()}s`;
  };

  /* ---------------- PAYMENT ACTIONS ---------------- */
  const payPenality = async (penalityId, provider) => {
    try {
      const res = await axios.post(`${backendURL}/payPenality`, {
        penalityId,
        provider,
      });
      // window.location.href = res.data.url; // Redirect to Stripe
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const cancelPenality = async (id) => {
    await penalityServices.remove(id);
    fetchPenality();
  };

  // ....... PrintPenality ......
  const onPrintPenality = (record) => {
    setPrintPenality(record);
    setPrintOpen(true);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      title: "Car Detail",
      dataIndex: "car",
    },
    {
      title: "Driver License",
      dataIndex: "license",
    },
    {
      title: "Penality by",
      dataIndex: "setby",
    },
    { title: "Pmt Code", dataIndex: "penalityCode" },
    {
      title: "Pmt Amount",
      dataIndex: "amount",
    },
    {
      title: "Pmt Status",
      dataIndex: "status",
      render: renderStatus,
    },
    // {
    //   title: "Expires In",
    //   render: (_, record) =>
    //     ["reserved", "pending"].includes(record.status)
    //       ? timeLeft(record)
    //       : "-",
    // },
    {
      title: "Time Left",
      render: (r) => {
        const remaining =
          24 * 60 * 60 * 1000 - (Date.now() - new Date(r.createdAt));
        return remaining > 0
          ? `${Math.floor(remaining / 3600000)} Hr.`
          : "Expired";
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size="small">
          {(record.status === "opened" || record.status === "pending") && (
            <Tooltip title="Pay">
              <Button
                icon={<DollarOutlined />}
                size="small"
                type="link"
                style={{
                  alignItems: "center",
                  fontSize: "12px",
                  height: "12px",
                }}
                // onClick={() => payPenality(record._id)}
                onClick={() => openPaymentModal(record._id)}
              />
            </Tooltip>
          )}

          {record.status === "paid" && (
            <>
              <Tooltip title="Print">
                <Button
                  icon={<PrinterOutlined />}
                  size="small"
                  type="link"
                  style={{
                    alignItems: "center",
                    fontSize: "12px",
                    height: "12px",
                  }}
                  onClick={
                    () =>
                      window.open(
                        `/penality_view/${record._id}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    // onPrintPenality(record)
                  }
                />
              </Tooltip>

              <Tooltip title="Download">
                <Button
                  icon={<DownloadOutlined />}
                  size="small"
                  type="link"
                  style={{
                    alignItems: "center",
                    fontSize: "12px",
                    height: "12px",
                  }}
                />
              </Tooltip>
            </>
          )}

          {record.status !== "canceled" && (
            <Popconfirm
              title="Cancel this penality?"
              onConfirm={() => cancelPenality(record._id)}
            >
              <Button
                icon={<CloseOutlined />}
                size="small"
                danger
                style={{
                  alignItems: "center",
                  fontSize: "12px",
                  height: "12px",
                }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const paymentMethods = [
    {
      key: "stripe",
      name: "Stripe",
      logo: stripe,
    },
    {
      key: "chapa",
      name: "CHAPA",
      logo: chapa,
    },
    {
      key: "telebirr",
      name: "Telebirr",
      logo: telebirr,
    },
    {
      key: "cbebirr",
      name: "CBE Birr",
      logo: cbebirr,
    },
    {
      key: "mpesa",
      name: "M-PESA",
      logo: mpesa,
    },
    {
      key: "mastercard",
      name: "Master Card",
      logo: mastercard,
    },
    {
      key: "paypal",
      name: "PayPal",
      logo: paypal,
    },
  ];

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Table
        size="small"
        bordered
        className="compactTable stripedTable coloredHeader"
        rowClassName={(_, index) =>
          index % 2 === 0 ? "rowColerOne" : "rowColerTwo"
        }
        rowKey="_id"
        columns={columns}
        dataSource={penality}
        loading={loading}
        pagination={false}
      />

      {/* Print Modal */}
      <Modal
        open={printOpen}
        onCancel={() => setPrintOpen(false)}
        footer={null}
        width={400}
      >
        {/* <PrintablePenality penality={printPenality} /> */}

        {/* <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="primary" onClick={() => window.print()}>
            Print
          </Button>
        </div> */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* Print Button */}
          <Button type="primary" onClick={() => window.print()}>
            Print
          </Button>

          {/* Export PDF Button */}
          <Button
            type="default"
            onClick={async () => {
              if (!printPenality) return;

              const input = document.querySelector(".print-penality"); // select the ticket div
              if (!input) return;

              try {
                const canvas = await html2canvas(input, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");

                // A4 page size in mm
                const pdf = new jsPDF("p", "mm", "a4");
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Calculate image dimensions to fit A4
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pageWidth;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Penality_${printPenality.reservationCode}.pdf`);
              } catch (err) {
                console.error("Failed to export PDF", err);
              }
            }}
          >
            Export PDF
          </Button>
        </div>
      </Modal>

      <Modal
        title="Choose Payment Method"
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          {paymentMethods.map((method) => (
            <Col span={12} key={method.key}>
              <Card
                hoverable
                onClick={() => payPenality(selectedPenalityId, method.key)}
                style={{
                  textAlign: "center",
                  cursor: "pointer",

                  border:
                    provider === method.key
                      ? "2px solid #1677ff"
                      : "1px solid #d9d9d9",
                }}
              >
                <img
                  src={method.logo}
                  alt={method.name}
                  style={{
                    height: 50,
                    objectFit: "contain",
                    marginBottom: 10,
                  }}
                />

                <div>{method.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
}
