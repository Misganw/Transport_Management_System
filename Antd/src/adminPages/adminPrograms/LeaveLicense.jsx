// LeaveLicenseView.jsx
import React from "react";
import {
  Button,
  Card,
  Row,
  Col,
  QRCode,
  Table,
  Divider,
  Typography,
} from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import "./printCSS.css";
import dayjs from "dayjs";

// .......... END OF IMPORTING ......
export default function LeaveLicense({ program }) {
  const { Text } = Typography;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const licenseRef = useRef(); // Ref for license content
  const qrValue = JSON.stringify({
    program_Code: program._id,
    Route: `${program.routId?.departure}-${program.routId?.arrival}`,
    queue: program.queue,
    date: program.date,
  });

  const logoUrl = program.companyId?.companyLogo
    ? `${backendURL}${program.companyId.companyLogo}`
    : null;

  // ===== Export PDF =====
  const exportPDF = async () => {
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
  };

  // ===== Print only license =====
  const printLicense = () => {
    window.print();
  };
  return (
    <>
      <div className="print-program">
        <img
          src={logoUrl}
          alt="Station Logo"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 280,
            opacity: 0.08,
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <h2 style={{ textAlign: "center" }}>Station Leaving License</h2>
        <hr />
        {/* Top section: Left info + QR code */}
        <div className="program-header">
          <div className="program-info">
            <p>
              <strong>Company:</strong> {program.companyId?.companyName}
            </p>
            <p>
              <strong>Route:</strong> {program?.routId?.departure} to{" "}
              {program?.routId?.arrival}
            </p>
            <p>
              <strong>Printed By:</strong> {program.userId?.name}
            </p>
          </div>
          <div className="program-qr">
            {/* Replace src with your QR code source */}
            <QRCode value={qrValue} size={150} alt="QR Code" />
          </div>
        </div>

        <hr />

        {/* Table for remaining info */}
        <table className="program-table">
          <tbody>
            <tr>
              <td>
                <strong>Car:</strong>
              </td>
              <td>
                {program.carId?.type} | {program.carId?.level}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Queue:</strong>
              </td>
              <td>{program.queue}</td>
            </tr>
            <tr>
              <td>
                <strong>No# of seats:</strong>
              </td>
              <td>{program.NoofSeats}</td>
            </tr>
            <tr>
              <td>
                <strong>Paid Seat:</strong>
              </td>
              <td>{program.paidSeatCount}</td>
            </tr>
            <tr>
              <td>
                <strong>Tarrif:</strong>
              </td>
              <td>{program.tarrif} Birr</td>
            </tr>
            <tr>
              <td>
                <strong>Date:</strong>
              </td>
              <td>{dayjs(program.createdAt).format("DD MMM YYYY HH:mm")}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <small>Thank you for traveling with us</small>
        </div>
      </div>
    </>
  );
}
