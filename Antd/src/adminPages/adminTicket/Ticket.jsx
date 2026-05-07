import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Tooltip, Popconfirm, Modal } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import TicketForm from "./TicketForm.jsx";
import { toast } from "react-toastify";
import {
  DollarOutlined,
  PrinterOutlined,
  DownloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
// import { ticketServices } from "../../admin/common/makeServices.js";
import axios from "axios";
import "../../admin/css/AdminPage.css";
import "../../admin/css/TableCSS.css";
import PrintableTicket from "./PrintableTicket.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ticketService } from "../../admin/common/makeServices.js";
import DynamicTable from "../../admin/common/DynamicTable.jsx";
import LeaveLicense from "../adminPrograms/LeaveLicense.jsx";
import TicketModal from "../adminPrograms/TicketModal.jsx";
// ..... end of import .....

// ....... END OF IMPORTING .......

dayjs.extend(duration);

export default function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, forceTick] = useState(0); // for countdown refresh
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [printTicket, setPrintTicket] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [reserveProgram, setReserveProgram] = useState(null);

  /* ---------------- FETCH TICKETS ---------------- */
  // const fetchTickets = async () => {
  //   setLoading(true);
  //   try {
  //     // const res = await axios.get(`${backendURL}/cancelTicket/${programId}`);
  //     const res = await axios.ticketService.list();
  //     // ALWAYS make sure it's an array
  //     const data = Array.isArray(res.data) ? res.data : [];
  //     setTickets(data);
  //   } catch (err) {
  //     setTickets([]);
  //     console.error("Failed to load tickets", err);
  //     toast.err(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // /* ---------------- INITIAL LOAD ---------------- */
  // useEffect(() => {
  //   fetchTickets();
  // }, [ticketId]);

  // /* ---------------- COUNTDOWN REFRESH ---------------- */
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     forceTick((t) => t + 1);
  //   }, 60000); // refresh every minute
  //   return () => clearInterval(timer);
  // }, []);

  const canceleTicket = async (ticketId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${backendURL}/cancelTicket/${ticketId}`);
      // fetchTickets(); // Refresh the ticket list after deletion
      toast.success(res.data.message);
      // fetchTickets();
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
  const payTicket = async (ticketId) => {
    try {
      const res = await axios.post(`${backendURL}/payTicket`, { ticketId });
      window.location.href = res.data.url; // Redirect to Stripe
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  // ....... PrintTicket ......
  const onPrintTicket = (record) => {
    setPrintTicket(record);
    setPrintOpen(true);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      title: "Rout",
      dataIndex: "rout",
      key: "rout",
      sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
    },
    {
      title: "Reservation Code",
      dataIndex: "reservationCode",
    },
    {
      title: "Passenger",
      dataIndex: "passengerName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
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
    //   title: "Actions",
    //   render: (_, record) => (
    //     <Space size="small">
    //       {(record.paymentStatus === "reserved" ||
    //         record.paymentStatus === "pending") && (
    //         <Tooltip title="Pay">
    //           <Button
    //             icon={<DollarOutlined />}
    //             size="small"
    //             type="link"
    //             style={{
    //               alignItems: "center",
    //               fontSize: "12px",
    //               height: "12px",
    //             }}
    //             onClick={() => payTicket(record._id)}
    //           />
    //         </Tooltip>
    //       )}

    //       {record.paymentStatus === "paid" && (
    //         <>
    //           <Tooltip title="Print">
    //             <Button
    //               icon={<PrinterOutlined />}
    //               size="small"
    //               type="link"
    //               style={{
    //                 alignItems: "center",
    //                 fontSize: "12px",
    //                 height: "12px",
    //               }}
    //               onClick={() => onPrintTicket(record)}
    //             />
    //           </Tooltip>

    //           <Tooltip title="Download">
    //             <Button
    //               icon={<DownloadOutlined />}
    //               size="small"
    //               type="link"
    //               style={{
    //                 alignItems: "center",
    //                 fontSize: "12px",
    //                 height: "12px",
    //               }}
    //             />
    //           </Tooltip>
    //         </>
    //       )}

    //       {record.paymentStatus !== "canceled" && (
    //         <Popconfirm
    //           title="Cancel this ticket?"
    //           onConfirm={() => canceleTicket(record._id)}
    //         >
    //           <Button
    //             icon={<CloseOutlined />}
    //             size="small"
    //             danger
    //             style={{
    //               alignItems: "center",
    //               fontSize: "12px",
    //               height: "12px",
    //             }}
    //           />
    //         </Popconfirm>
    //       )}
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <DynamicTable
        title="Ticketes"
        resourceName="ticketes"
        columnsDef={[
          ...columns,
          {
            title: "Print|Cancele",
            key: "reserve",
            fixed: "right",
            width: 120,
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
                      onClick={() => payTicket(record._id)}
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
        ]}
        service={ticketService}
        /*  Disable create & edit */
        hideCreate
        // hideEdit
        FormComponent={TicketForm}
        transformRecord={(r) => ({
          ...r,
          Tarrif: r.programId?.Tarrif ?? "Unknown",
          QueueNo: r.programId?.QueueNo ?? "N/A",
          rout: r.programId.routId
            ? `${r.programId?.routId?.departure} → ${r.programId?.routId?.arrival}`
            : "Unknown",
        })}
        renderExpanded={(raw) => (
          <div style={{ padding: 12, lineHeight: "1.8" }}>
            <div>
              <strong>Route:</strong> {raw.programId?.routId?.departure} →{" "}
              {raw.programId?.routId?.arrival}
            </div>
            <div>
              <strong>Car Information:</strong>{" "}
              {raw.programId?.carId?.type || "Unknown"} |{" "}
              {raw.programId?.carId?.level || "Unknown"}
            </div>
            <div>
              <strong>Program Queue:</strong>
              {raw.programId.queue}
            </div>
            <div>
              <strong>Paid Amount:</strong> {raw.programId?.tarrif || "Unknown"}{" "}
              Birr
            </div>
            <div>
              <strong>Payment Method:</strong> {raw.paymentMethod || "Unknown"}
            </div>
            <div>
              <strong> Passenger Name: </strong>
              {raw.passengerName || "Unknown Passenger"}
            </div>
            <div>
              <strong>Email:</strong> {raw.email || "Unknown Email"}
            </div>
            <div>
              <strong>Phone Number:</strong> {raw.phone || "Unknown Phone"}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(raw.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Updated At:</strong>{" "}
              {new Date(raw.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      />
      {/* {reserveProgram && (
        <TicketModal
          program={reserveProgram}
          onClose={() => setReserveProgram(null)}
        />
      )} */}

      {/* Ticket Print Modal */}
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
    </>
  );
}
