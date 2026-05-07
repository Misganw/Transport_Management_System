import React from "react";
import dayjs from "dayjs";
import "./printTicket.css";
import { Typography, QRCode } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrintableTicket({ ticket }) {
  if (!ticket) return null;
  const qrValue = JSON.stringify({
    Route: `${ticket.programId?.routId?.departure}-${ticket.programId?.routId?.arrival}`,
    queue: ticket.programId?.queue,
    Ticket_Code: ticket._id,
    Reservation_Code: ticket.reservationCode,
    Passenger_Name: ticket.passengerName,
    Phone: ticket.phone,
    Email: ticket.email,
    Printed_By: ticket.userId?.name,
    date: ticket.programId?.date,
  });

  return (
    <div className="print-ticket">
      <h2 style={{ textAlign: "center" }}>Passenger Ticket Detail</h2>
      <hr />
      {/* Top section: Left info + QR code */}
      <div className="ticket-header">
        <div className="ticket-info">
          <p>
            <strong>Company:</strong> {ticket.companyId?.companyName}
          </p>
          <p>
            <strong>Route:</strong> {ticket.programId?.routId?.departure} to{" "}
            {ticket.programId?.routId?.arrival}
          </p>
          <p>
            <strong>Printed By:</strong> {ticket.userId?.name}
          </p>
        </div>
        <div className="ticket-qr">
          {/* Replace src with your QR code source */}
          <QRCode value={qrValue} size={150} alt="QR Code" />
        </div>
      </div>

      <hr />

      {/* Table for remaining info */}
      <table className="ticket-table">
        <tbody>
          <tr>
            <td>
              <strong>Passenger:</strong>
            </td>
            <td>{ticket.passengerName}</td>
          </tr>
          <tr>
            <td>
              <strong>Phone:</strong>
            </td>
            <td>{ticket.phone}</td>
          </tr>
          <tr>
            <td>
              <strong>Reservation Code:</strong>
            </td>
            <td>{ticket.reservationCode}</td>
          </tr>
          <tr>
            <td>
              <strong>Status:</strong>
            </td>
            <td>
              {ticket.paymentStatus} {ticket.programId?.tarrif} Birr
            </td>
          </tr>
          <tr>
            <td>
              <strong>Paid Birr:</strong>
            </td>
            <td>{ticket.programId?.tarrif} Birr</td>
          </tr>
          <tr>
            <td>
              <strong>Date:</strong>
            </td>
            <td>{dayjs(ticket.createdAt).format("DD MMM YYYY HH:mm")}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <small>Thank you for traveling with us</small>
      </div>
    </div>
  );
}
