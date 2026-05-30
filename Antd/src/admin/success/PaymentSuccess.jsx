import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Spin, Descriptions, Button } from "antd";
import axios from "axios";

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

  // useEffect(() => {
  //   if (!ticketId) {
  //     setError("Ticket ID not found in URL");
  //     setLoading(false);
  //     return;
  //   }

  //   const fetchTicket = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${backendURL}/getPymentInfo/${ticketId}`,
  //       );
  //       setTicket(response.data);
  //     } catch (err) {
  //       console.error("Failed to fetch ticket details:", err);
  //       setError(
  //         err.response?.data?.message || "Failed to fetch ticket details",
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTicket();
  // }, [ticketId]);

  if (loading) return <Spin tip="Loading payment details..." />;

  if (error) return <Result status="error" title="Error" subTitle={error} />;

  if (!data)
    return (
      <Result
        status="error"
        title="Data Not Found"
        subTitle="Cannot find your ticket details."
      />
    );

  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle={
        paymentType === "ticket"
          ? "Your ticket is confirmed and ready to print."
          : "Your penality payment was completed successfully."
      }
      extra={[
        <Button type="link" key="dashboard" onClick={goToDashboard}>
          Back to Dashboard
        </Button>,
      ]}
    >
      <Descriptions bordered column={1} style={{ marginTop: 20 }}>
        {/* ========================= */}
        {/* TICKET DETAILS */}
        {/* ========================= */}
        {paymentType === "ticket" && (
          <>
            <Descriptions.Item label="Passenger Name">
              {data.passengerName}
            </Descriptions.Item>

            <Descriptions.Item label="Email">{data.email}</Descriptions.Item>

            <Descriptions.Item label="Seat Number">
              {data.seatNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Route">
              {data.route || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Ticket Price">
              ${data.paidAmount || "N/A"}
            </Descriptions.Item>
          </>
        )}

        {/* ========================= */}
        {/* PENALITY DETAILS */}
        {/* ========================= */}
        {paymentType === "penality" && (
          <>
            <Descriptions.Item label="Company">
              {data.companyName || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Reporter Email">
              {data.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Reporter Phone">
              {data.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Penalty Code">
              {data.paymentCode}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">${data.amount}</Descriptions.Item>
            <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
            <Descriptions.Item label="Route">
              {data.route || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Set By">
              {data.setBy || "N/A"}
            </Descriptions.Item>
          </>
        )}

        {/* ========================= */}
        {/* PAYMENTS */}
        {/* ========================= */}
        {data.payments && data.payments.length > 0 ? (
          data.payments.map((p, index) => (
            <Descriptions.Item
              key={index}
              label={`Payment via ${p.provider.toUpperCase()}`}
            >
              Amount: {p.amount} {p.currency?.toUpperCase()} <br />
              Paid At: {new Date(p.paidAt).toLocaleString()}
              <br />
              Customer: {p.customer_name} ({p.customer_email}) <br />
              Payment ID: {p.providerPaymentId}
            </Descriptions.Item>
          ))
        ) : (
          <Descriptions.Item label="Payments">
            No payment recorded
          </Descriptions.Item>
        )}
      </Descriptions>
    </Result>
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
