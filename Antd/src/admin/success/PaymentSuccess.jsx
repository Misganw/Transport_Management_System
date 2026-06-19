import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Result,
  Spin,
  Descriptions,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import PaymentReceipt from "./PaymentReceipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const { Title, Text } = Typography;
export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const ticketId = params.get("ticketId"); // get ticketId from URL query
  const penalityId = params.get("penalityId"); // get penalityId from URL query

  const [data, setData] = useState(null);
  // const [ticket, setTicket] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL; // e.g., http://localhost:5000
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/adminDashboard"); // change path if yours is different
  };

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        let response;
        // =========================
        // TICKET PAYMENT
        // =========================
        if (ticketId) {
          setPaymentType("ticket");

          response = await axios.get(`${backendURL}/getPymentInfo/${ticketId}`);
        }

        // =========================
        // PENALITY PAYMENT
        // =========================
        else if (penalityId) {
          setPaymentType("penality");

          response = await axios.get(
            `${backendURL}/getPaymentInfo/${penalityId}`,
          );
        }

        // =========================
        // NO ID FOUND
        // =========================
        else {
          setError("Payment ID not found in URL");
          setLoading(false);
          return;
        }

        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch payment details:", err);

        setError(
          err.response?.data?.message || "Failed to fetch payment details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [ticketId, penalityId]);

  if (loading) return <Spin tip="Loading payment details..." />;

  if (error) return <Result status="error" title="Error" subTitle={error} />;

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
        <PaymentReceipt data={data} paymentType={paymentType} />
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
          Print Receipt
        </Button>

        <Button onClick={downloadPDF}>Download PDF</Button>

        <Button onClick={goToDashboard}>Back To Dashboard</Button>
      </div>
    </>
  );
  // return (
  //   <Result
  //     status="success"
  //     title="Payment Successful!"
  //     subTitle="Your ticket is confirmed and ready to print."
  //     extra={[
  //       <Button type="link" key="dashboard" onClick={goToDashboard}>
  //         Back to Dashboard
  //       </Button>,
  //     ]}
  //   >
  //     <Descriptions bordered column={1} style={{ marginTop: 20 }}>
  //       <Descriptions.Item label="Passenger Name">
  //         {ticket.passengerName}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="Email">{ticket.email}</Descriptions.Item>
  //       <Descriptions.Item label="Seat Number">
  //         {ticket.seatNumber}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="Route">
  //         {/* {ticket.programId?.routId?.departure} →{" "}
  //         {ticket.programId?.routId?.arrival} */}
  //         {ticket.route || "N/A"}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="Ticket Price">
  //         ${ticket.paidAmount || "N/A"}
  //       </Descriptions.Item>

  //       {/* ........ Display dynamic iTEM  */}
  //       {/* {ticket.payments.map((p, index) => (
  //         <Descriptions.Item
  //           key={index}
  //           label={`Payment via ${p.provider.toUpperCase()}`}
  //         >
  //           Amount: ${p.amount} {p.currency.toUpperCase()} <br />
  //           Paid At: {new Date(p.paidAt).toLocaleString()} <br />
  //           Customer: {p.customer_name} ({p.customer_email}) <br />
  //           Payment ID: {p.providerPaymentId}
  //         </Descriptions.Item>
  //       ))} */}

  //       {ticket.payments && ticket.payments.length > 0 ? (
  //         ticket.payments.map((p, index) => (
  //           <Descriptions.Item
  //             key={index}
  //             label={`Payment via ${p.provider.toUpperCase()}`}
  //           >
  //             Amount: {p.amount} {p.currency.toUpperCase()} <br />
  //             Paid At: {new Date(p.paidAt).toLocaleString()} <br />
  //             Customer: {p.customer_name} ({p.customer_email}) <br />
  //             Payment ID: {p.providerPaymentId}
  //           </Descriptions.Item>
  //         ))
  //       ) : (
  //         <Descriptions.Item label="Payments">
  //           No payment recorded
  //         </Descriptions.Item>
  //       )}
  //     </Descriptions>
  //   </Result>
  // );
}
