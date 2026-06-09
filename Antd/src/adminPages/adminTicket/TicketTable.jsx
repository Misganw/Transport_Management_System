import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
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
import axios from "axios";
import "../../admin/css/AdminPage.css";
import "../../admin/css/TableCSS.css";
import PrintableTicket from "./PrintableTicket.jsx";
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

export default function TicketTable({ programId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, forceTick] = useState(0); // for countdown refresh
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [printTicket, setPrintTicket] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [provider, setProvider] = useState(null);

  /* ---------------- Pay Modal  ---------------- */
  const openPaymentModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setProvider(null);
    setPaymentModalOpen(true);
  };

  /* ---------------- FETCH TICKETS ---------------- */
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendURL}/getTicketByProgram/${programId}`,
      );
      // ALWAYS make sure it's an array
      const data = Array.isArray(res.data) ? res.data : [];
      setTickets(data);
    } catch (err) {
      setTickets([]);
      console.error("Failed to load tickets", err);
      toast.error(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchTickets();
  }, [programId]);

  /* ---------------- COUNTDOWN REFRESH ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      forceTick((t) => t + 1);
    }, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  const canceleTicket = async (ticketId) => {
    try {
      setLoading(true);
      await axios.delete(`${backendURL}/cancelTicket/${ticketId}`);
      fetchTickets(); // Refresh the ticket list after deletion
    } catch (err) {
      // toast.error("Failed to cancel ticket: " + err.message);
      toast.error(err.response?.data?.message || "Failed to cancel ticket");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const renderStatus = (status) => {
    const colors = {
      reserved: "blue",
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
  const payTicket = async (ticketId, provider) => {
    try {
      const res = await axios.post(`${backendURL}/payTicket`, {
        ticketId,
        provider,
      });
      // window.location.href = res.data.url; // Redirect to Stripe
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Payment initiation failed", err);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const cancelTicket = async (id) => {
    await ticketService.remove(id);
    fetchTickets();
  };

  // ....... PrintTicket ......
  const onPrintTicket = (record) => {
    setPrintTicket(record);
    setPrintOpen(true);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      title: "Passenger",
      dataIndex: "passengerName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Reservation Code",
      dataIndex: "reservationCode",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      render: renderStatus,
    },
    {
      title: "Expires In",
      render: (_, record) =>
        ["reserved", "pending"].includes(record.paymentStatus)
          ? timeLeft(record)
          : "-",
    },
    // {
    //   title: "Time Left",
    //   render: (r) => {
    //     const remaining = 60 * 60 * 1000 - (Date.now() - new Date(r.createdAt));
    //     return remaining > 0
    //       ? `${Math.floor(remaining / 60000)} min`
    //       : "Expired";
    //   },
    // },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size="small">
          {(record.paymentStatus === "reserved" ||
            record.paymentStatus === "pending") && (
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
                // onClick={() => payTicket(record._id)}
                onClick={() => openPaymentModal(record._id)}
              />
            </Tooltip>
          )}

          {record.paymentStatus === "paid" && (
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
                  onClick={() => onPrintTicket(record)}
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

          {record.paymentStatus !== "canceled" && (
            <Popconfirm
              title="Cancel this ticket?"
              onConfirm={() => canceleTicket(record._id)}
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
        dataSource={tickets}
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
        <PrintableTicket ticket={printTicket} />

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
              if (!printTicket) return;

              const input = document.querySelector(".print-ticket"); // select the ticket div
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
                pdf.save(`Ticket_${printTicket.reservationCode}.pdf`);
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
                onClick={() => payTicket(selectedTicketId, method.key)}
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

        {/* <Button
          type="primary"
          block
          style={{ marginTop: 20 }}
          disabled={!provider}
          onClick={payTicket}
        >
          Proceed To Payment
        </Button> */}
      </Modal>
    </>
  );
}
