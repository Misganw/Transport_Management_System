// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
import TicketModal from "./TicketModal.jsx";
// import { makeService } from "../../admin/common/services";
import ProgramForm from "./Programs.jsx";
import { Avatar, Row, Col, Tag, Button, Tooltip, Modal, Space } from "antd";
import {
  BuildOutlined,
  LoginOutlined,
  SettingOutlined,
  FilterOutlined,
  EyeOutlined,
  RestOutlined,
  PrinterOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  programServices,
  routService,
  tarrifService,
} from "../../admin/common/makeServices";
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";
import LeaveLicense from "../../adminPages/adminPrograms/LeaveLicense.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AppContext } from "../../context/AppContext.jsx";

// ....... END OF IMPORTING .......

// const service = makeService("employees");
const columnsProgram = [
  {
    title: "Route",
    dataIndex: "rout",
    key: "rout",
    sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
  },
  {
    title: "Care Type | Level | Plate",
    dataIndex: "carType",
    key: "carType",
    sorter: (a, b) => (a.carType || "").localeCompare(b.carType || ""),
  },
  {
    title: "Price in Birr",
    dataIndex: "tarrif",
    key: "tarrif",
    sorter: (a, b) => a.tarrif - b.tarrif,
  },
  {
    title: "Queue Number",
    dataIndex: "queue",
    key: "queue",
    sorter: (a, b) => a.queue - b.queue,
  },
  {
    title: "No of Seats",
    dataIndex: "NoofSeats",
    key: "NoofSeats",
    render: (_, record) =>
      `${record.raw?.paidSeatCount || 0}/${record.raw?.carId?.NoofSeats || 0}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    render: (status) => {
      const statusColors = {
        active: "green",
        canceled: "red",
        full: "darkgreen",
        scheduled: "blue",
        out: "gray",
        inside: "purple",
      };
      return (
        <Tag bordered={false} color={statusColors[status] || "default"}>
          {status?.toLowerCase()}
        </Tag>
      );
    },
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "No Date"),
    sorter: (a, b) => a.date - b.date,
  },
];

export default function ProgramTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ROLE Filteration for actions
  const rawRoles = useContext(AppContext)?.userData?.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];
  const hasRole = (...allowedRoles) => {
    return roles.some((r) => allowedRoles.includes(r));
  };
  const canCreate = hasRole("admin", "manager", "coordinator");
  const canEdit = hasRole("admin", "manager", "coordinator");
  const canDelete = hasRole("admin", "manager", "coordinator");
  const canView = hasRole(
    "admin",
    "manager",
    "coordinator",
    "officer",
    "passeneger",
  );
  const canRestore = hasRole("admin", "manager", "coordinator", "officer");
  // ROLE Filteration for actions

  const [reserveProgram, setReserveProgram] = useState(null);
  const [ticketProgramId, setTicketProgramId] = useState(null);
  const { userData } = useContext(AppContext);
  // const [leaveLicense, setleaveLicense] = useState(null);

  const [printLeaveLicense, setPrintLeaveLicense] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  const onTicketClick = (record) => {
    setTicketProgramId(record.key);
  };

  // ....... Print Leave License ......
  const onPrintLeaveLicence = (record) => {
    setPrintLeaveLicense(record);
    setPrintOpen(true);
  };

  const isProgramDatePassed = (programDate) => {
    if (!programDate) return true;
    const today = dayjs().format("YYYY-MM-DD");
    const programDay = dayjs(programDate).format("YYYY-MM-DD");

    return today > programDay; // string comparison works for ISO dates
  };
  return (
    <>
      <DynamicTable
        title="Programs"
        resourceName="programs"
        columnsDef={[
          ...columnsProgram,
          {
            title: "Booking|Printing|Tickets",
            key: "reserve",
            fixed: "right",
            width: 120,
            render: (_, record) => (
              <Space size="small">
                <Tooltip
                  title={
                    isProgramDatePassed(record.raw.date)
                      ? "Cannot book: program date has passed"
                      : "Book Ticket"
                  }
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    disabled={
                      record.raw.status === "full" ||
                      record.raw.status === "scheduled" ||
                      record.raw.status === "come inside" ||
                      record.raw.status === "out" ||
                      isProgramDatePassed(record.raw.date) ||
                      record.raw.status === "Date Passed"
                    }
                    onClick={() => setReserveProgram(record.raw)}
                    icon={<RestOutlined />}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    isProgramDatePassed(record.raw.date) ||
                    userData.roles !== "admin" ||
                    userData.roles !== "coordinator"
                      ? "Cannot print: program date has passed or insufficient permissions"
                      : "Print Station Leaving License"
                  }
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    disabled={
                      record.raw.status !== "full" ||
                      isProgramDatePassed(record.raw.date) ||
                      userData.roles !== "admin" ||
                      userData.roles !== "coordinator"
                    }
                    onClick={() => onPrintLeaveLicence(record)}
                    icon={<PrinterOutlined />}
                  />
                </Tooltip>
                <Tooltip title="Reserved ticket Lists">
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    disabled={
                      record.raw.status === "scheduled" ||
                      record.raw.status === "come inside"
                    }
                    onClick={() => onTicketClick(record)}
                    icon={<QrcodeOutlined />}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
        service={programServices}
        FormComponent={ProgramForm}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        canView={canView}
        canRestore={canRestore}
        transformRecord={(r) => ({
          ...r,
          rout: `${r.routId?.departure || "Unknown"} -> ${
            r.routId?.arrival || "Unknown"
          }`.trim(),
          carType: r.carId
            ? `${r.carId?.type || ""} | ${r.carId?.level || ""} | ${r.carId?.plateNumber || ""}`
            : "Unknown",
          carLevel: r.carId ? `${r.carId?.level || ""}` : "Unknown",
          NoofSeats: r.carId ? `${r.carId?.NoofSeats || ""}` : "Unknown",
          companyName: r.companyId
            ? `${r.companyId.companyName || ""}`
            : "Unknown",
          Tarrif: r.tarrif || "Uknown",
        })}
        renderExpanded={(raw) => (
          <div style={{ padding: 12, lineHeight: "1.8" }}>
            <div>
              <strong>Rout:</strong>
              {raw.routId?.departure || raw.departure} {"->"}{" "}
              {raw.routId?.arrival || raw.arrival}
            </div>
            <div>
              <strong>Car Type:</strong>
              {raw.carId?.type || raw.carId.type}
            </div>
            <div>
              <strong>Level:</strong>
              {raw.carId?.level || raw.carId.level}
            </div>
            <div>
              <strong>Amount in Birr:</strong> {raw.tarrif}
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
        // ....... to view reserved tickets ......
        ticketProgramId={ticketProgramId}
        onTicketClick={(record) => {
          setTicketProgramId(record.key);
        }}
        onTicketExpandChange={(keys) => {
          // If the ticket row is collapsed, clear ticketProgramId
          if (ticketProgramId && !keys.includes(ticketProgramId)) {
            setTicketProgramId(null);
          }
        }}
      />

      {reserveProgram && (
        <TicketModal
          program={reserveProgram}
          onClose={() => setReserveProgram(null)}
        />
      )}
      {/* Leave License Print Modal */}
      <Modal
        open={printOpen}
        onCancel={() => setPrintOpen(false)}
        footer={null}
        width={400}
      >
        <LeaveLicense program={printLeaveLicense} />
        <div className="printLicence">
          {/* Print Button */}
          <Button
            type="primary"
            onClick={() => {
              document.body.classList.add("printing");
              window.print();
              setTimeout(() => {
                document.body.classList.remove("printing");
              }, 500);
            }}
          >
            Print
          </Button>

          {/* Export PDF Button */}
          <Button
            type="default"
            onClick={async () => {
              if (!printLeaveLicense) return;

              const input = document.querySelector(".print-program"); // select the program div
              if (!input) return;

              try {
                const canvas = await html2canvas(input, {
                  scale: 3,
                  backgroundColor: "#fff",
                });

                const imgData = canvas.toDataURL("image/png");

                // Create A4 PDF
                const pdf = new jsPDF("p", "mm", "a4");
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // === IMPORTANT PART ===
                // Real receipt width (80mm)
                const receiptWidth = 80;

                // Keep aspect ratio
                const receiptHeight =
                  (canvas.height * receiptWidth) / canvas.width;

                // Center horizontally on A4
                const x = (pageWidth - receiptWidth) / 2;

                // Small top margin
                const y = 10;

                // Add image
                pdf.addImage(imgData, "PNG", x, y, receiptWidth, receiptHeight);

                // Save PDF
                pdf.save(`Ticket_${printLeaveLicense._id}.pdf`);
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
