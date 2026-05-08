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

// ....... END OF IMPORTING .......

// const service = makeService("employees");
const columnsViolation = [
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
    title: "Type |Level |Model |Plate",
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
    title: "Reported Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => a.date - b.date,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    render: (status) => {
      const statusColors = {
        opened: "green",
        pending: "red",
        action: "darkgreen",
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
        title="Violations Reported"
        resourceName="violations"
        columnsDef={[
          ...columnsViolation,
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
                    disabled={isProgramDatePassed(record.raw.date)}
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
        service={voilationService}
        FormComponent={VoilationForm}
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
              <strong>SubRout:</strong>
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
    </>
  );
}
