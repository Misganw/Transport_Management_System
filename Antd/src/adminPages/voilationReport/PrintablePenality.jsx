import React from "react";
import dayjs from "dayjs";
import "./printPenality.css";
import { Typography, QRCode } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrintableTicket({ penality }) {
  if (!penality) return null;
  const qrValue = JSON.stringify({
    Route: `${penality.reportId?.routId?.departure}-${penality.reportId?.routId?.arrival}`,
    queue: penality.reportId?.queue,
    Ticket_Code: penality._id,
    Reservation_Code: penality.reservationCode,
    Passenger_Name: penality.passengerName,
    Phone: penality.phone,
    Email: penality.email,
    Printed_By: penality.userId?.name,
    date: penality.reportId?.date,
  });

  return (
    <div className="print-penality">
      <h2 style={{ textAlign: "center" }}>Passenger Ticket Detail</h2>
      <hr />
      {/* Top section: Left info + QR code */}
      <div className="ticket-header">
        <div className="ticket-info">
          <p>
            <strong>Company:</strong> {penality.companyId?.companyName}
          </p>
          <p>
            <strong>Route:</strong> {penality.reportId?.routId?.departure} to{" "}
            {penality.reportId?.routId?.arrival}
          </p>
          <p>
            <strong>Printed By:</strong> {penality.userId?.name}
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
            <td>{penality.passengerName}</td>
          </tr>
          <tr>
            <td>
              <strong>Phone:</strong>
            </td>
            <td>{penality.phone}</td>
          </tr>
          <tr>
            <td>
              <strong>Reservation Code:</strong>
            </td>
            <td>{penality.reservationCode}</td>
          </tr>
          <tr>
            <td>
              <strong>Status:</strong>
            </td>
            <td>
              {penality.paymentStatus} {penality.programId?.tarrif} Birr
            </td>
          </tr>
          <tr>
            <td>
              <strong>Paid Birr:</strong>
            </td>
            <td>{penality.programId?.tarrif} Birr</td>
          </tr>
          <tr>
            <td>
              <strong>Date:</strong>
            </td>
            <td>{dayjs(penality.createdAt).format("DD MMM YYYY HH:mm")}</td>
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
