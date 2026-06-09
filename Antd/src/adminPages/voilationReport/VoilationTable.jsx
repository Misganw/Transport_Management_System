// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import { AppContext } from "../../context/AppContext.jsx";
import { Button, Space, Tooltip, Modal, Avatar, Row, Col, Tag } from "antd";
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
  CheckOutlined,
  CloseOutlined,
  UndoOutlined,
  RedoOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  programServices,
  voilationService,
  routService,
  tarrifService,
} from "../../admin/common/makeServices";
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";
import LeaveLicense from "../../adminPages/adminPrograms/LeaveLicense.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import VoilationForm from "./VoilationForm.jsx";
import PenalityModal from "./penalityModal.jsx";
import axios from "axios";

// ....... END OF IMPORTING .......

// const service = makeService("employees");
const columnsViolation = [
  {
    title: "Reported Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => a.date - b.date,
  },
  {
    title: "Route",
    dataIndex: "rout",
    key: "rout",
    sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
  },
  {
    title: "Sub Route",
    dataIndex: "subRout",
    key: "subRout",
    sorter: (a, b) => (a.subRout || "").localeCompare(b.subRout || ""),
  },
  { title: "Reported to", dataIndex: "reportedTo", key: "reportedTo" },
  {
    title: "Car Info",
    dataIndex: "carType",
    key: "carType",
    sorter: (a, b) => (a.carType || "").localeCompare(b.carType || ""),
  },
  {
    title: "Reporter",
    dataIndex: "reporter",
    key: "reporter",
    sorter: (a, b) => a.reporter - b.reporter,
  },
  {
    title: "Rule Violated",
    dataIndex: "voilated",
    key: "voilated",
    sorter: (a, b) => a.voilated - b.voilated,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    render: (status) => {
      const statusColors = {
        claimed: "red",
        opened: "yellow",
        Punished: "green",
        paid: "darkgreen",
      };
      return (
        <Tag bordered={false} color={statusColors[status] || "default"}>
          {status?.toLowerCase()}
        </Tag>
      );
    },
  },
];

export default function VoilationTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ROLE Filteration for actions
  const rawRoles = useContext(AppContext)?.userData?.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];
  const hasRole = (...allowedRoles) => {
    return roles.some((r) => allowedRoles.includes(r));
  };
  const canCreate = hasRole("admin", "manager", "coordinator", "passenger");
  const canEdit = hasRole("admin", "manager", "coordinator", "officer");
  const canDelete = hasRole("admin", "manager", "coordinator", "officer");
  const canView = hasRole(
    "admin",
    "manager",
    "coordinator",
    "officer",
    "passeneger",
  );
  const canRestore = hasRole("admin", "manager", "coordinator", "officer");
  // ROLE Filteration for actions

  const [penality, setPenality] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [penalityReportId, setPenalityReportId] = useState(null);
  const { userData } = useContext(AppContext);

  const [printPenality, setPrintPenality] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  const onReportClick = (record) => {
    setReportId(record.key);
  };

  // ....... Print  Penalities ......
  const onPrintPenality = (record) => {
    setPrintPenality(record);
    setPrintOpen(true);
  };

  // const isReportDatePassed = (reportDate) => {
  //   if (!reportDate) return true;
  //   const today = dayjs().format("YYYY-MM-DD");
  //   const reportDay = dayjs(reportDate).format("YYYY-MM-DD");

  //   return today > reportDay; // string comparison works for ISO dates
  // };
  return (
    <>
      <DynamicTable
        title="Reported Violations"
        resourceName="violations"
        columnsDef={[
          ...columnsViolation,
          {
            title: "Create|Printing|Penalities",
            key: "penality",
            fixed: "right",
            width: 120,
            render: (_, record) => (
              <Space size="small">
                <Tooltip
                // title={
                //   isReportDatePassed(record.raw.date)
                //     ? "Cannot punish: Report date has passed"
                //     : " Punish"
                // }
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    // disabled={isReportDatePassed(record.raw.date)}
                    onClick={() => setPenality(record.raw)}
                    icon={<PlusOutlined />}
                    enabled={
                      userData.roles === "officer" || userData.roles === "admin"
                    }
                    disabled={userData.roles !== "officer"}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    userData.roles !== "admin" || userData.roles !== "officer"
                      ? "Cannot print: report date has passed or insufficient permissions"
                      : "Print Penality"
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
                      userData.roles !== "admin" ||
                      userData.roles !== "officer"
                    }
                    onClick={() => onPrintPenality(record)}
                    icon={<PrinterOutlined />}
                  />
                </Tooltip>
                <Tooltip title="Recorded penality Lists">
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
                    onClick={() => {
                      setPenalityReportId(record.key);
                    }}
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
        service={voilationService}
        FormComponent={VoilationForm}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        canView={canView}
        canRestore={canRestore}
        transformRecord={(r) => ({
          ...r,
          date: r.createdAt
            ? dayjs(r.createdAt).format("YYYY-MM-DD")
            : "No Date", // Use createdAt for sorting and display
          rout: `${r.ticketId?.programId?.routId?.departure || "Unknown"} <-> ${
            r.ticketId?.programId?.routId?.arrival || "Unknown"
          }`.trim(),
          carType: r.ticketId?.programId?.carId
            ? `${r.ticketId?.programId?.carId?.type || ""} | ${r.ticketId?.programId?.carId?.level || ""} | ${r.ticketId?.programId?.carId?.model || ""} | ${r.ticketId?.programId?.carId?.plateNumber || ""}`
            : "Unknown",
          subRout: r.officerAssignmentId?.subrouteId
            ? `${r.officerAssignmentId?.subrouteId?.subdeparture || ""} <-> ${r.officerAssignmentId?.subrouteId?.subarrival || ""}`
            : "Unknown",
          reportedTo: r.officerAssignmentId?.trafficOfficerId
            ? `${r.officerAssignmentId?.trafficOfficerId?.fName || ""} ${r.officerAssignmentId?.trafficOfficerId?.mName || ""}| ${r.officerAssignmentId?.trafficOfficerId?.phone || ""}`
            : "Unknown",
          reporter:
            r.userId?.roles === "passenger"
              ? `${r.ticketId?.passengerId?.fName || ""} ${r.ticketId?.passengerId?.lName || ""} | ${r.ticketId?.passengerId?.phone || ""}`
              : "By Admin",
          voilated: r.ruleID?.title || "Unknown",
          status: r.Status || "Unknown",
        })}
        renderExpanded={(raw) => (
          <div style={{ padding: 12, lineHeight: "1.8" }}>
            <div>
              <strong>Rout:</strong>
              {raw.ticketId?.programId?.routId?.departure || raw.departure}{" "}
              {"<->"} {raw.ticketId?.programId?.routId?.arrival || raw.arrival}
            </div>
            <div>
              <strong>SubRout:</strong>
              {raw.officerAssignmentId?.subrouteId?.subdeparture} {"<->"}{" "}
              {raw.officerAssignmentId?.subrouteId?.subarrival || raw.arrival}
            </div>
            <div>
              <strong>Traffic Police:</strong>
              {raw.officerAssignmentId?.trafficOfficerId?.fName} {"|"}
              {raw.officerAssignmentId?.trafficOfficerId?.mName} {"|"}
              {raw.officerAssignmentId?.trafficOfficerId?.lName} {"|"}
              {raw.officerAssignmentId?.trafficOfficerId?.phone}
            </div>
            <div>
              <strong>Car Type:</strong>
              {raw.ticketId?.programId?.carId?.type ||
                raw.ticketId?.programId?.carId.type}
            </div>
            <div>
              <strong>Level:</strong>
              {raw.ticketId?.programId?.carId?.level ||
                raw.ticketId?.programId?.carId.level}
            </div>
            <div>
              <strong>Detail case description: </strong>
              {raw.CaseDescription || "No additional details provided."}
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
        // ....... to view Penality ......
        onReportClick={(record) => {
          setPenalityReportId(record.key);
        }}
        penalityReportId={penalityReportId}
        onReportExpandChange={(keys) => {
          // If the report row is collapsed, clear penalityReportId
          if (penalityReportId && !keys.includes(penalityReportId)) {
            setPenalityReportId(null);
          }
        }}
      />

      {penality && (
        <PenalityModal report={penality} onClose={() => setPenality(null)} />
      )}
      {/* Leave License Print Modal */}
      <Modal
        open={printOpen}
        onCancel={() => setPrintOpen(false)}
        footer={null}
        width={400}
      >
        <LeaveLicense program={printPenality} />
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
              if (!printPenality) return;

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
                pdf.save(`Penality_${printPenality._id}.pdf`);
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
