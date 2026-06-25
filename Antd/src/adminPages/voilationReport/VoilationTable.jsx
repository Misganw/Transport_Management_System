// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
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
  EnvironmentOutlined,
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
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { socket } from "../../admin/common/socket.js";
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

export default function VoilationTable({ notificationReportId }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // const location = useLocation();
  // const notificationReportId = location.state?.reportId;

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

  // const [reportData, setReportData] = useState(null);
  // const [printOpen, setPrintOpen] = useState(false);

  const [expandedNotificationRow, setExpandedNotificationRow] = useState(null);

  const [checkStatus, setcheckStatus] = useState("");

  const onReportClick = (record) => {
    setReportId(record.key);
  };
  const canPenalize =
    userData.roles === "officer" ||
    userData.roles === "admin" ||
    userData.roles === "manager";
  const isStatus = (record) => {
    return record === "paid" || record === "punished";
  };

  const navigate = useNavigate();

  const mapRef = useRef(null);
  const watchRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [vehicleLocation, setVehicleLocation] = useState(null);

  return (
    <>
      <DynamicTable
        tracking
        // startTracking={startTracking}
        // stopTracking={stopTracking}
        notificationReportId={notificationReportId}
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
                    // enabled={
                    //   userData.roles === "officer" || userData.roles === "admin"
                    // }
                    disabled={!canPenalize}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    !canPenalize
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
                    disabled={!isStatus(record.raw.Status) || !canPenalize}
                    onClick={() =>
                      window.open(
                        `/voilationReports/report_view/${record.raw._id}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
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
                <Tooltip title="View Violation Location">
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    icon={<EnvironmentOutlined />}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${record.raw.location?.latitude},${record.raw.location?.longitude}`,
                        "_blank",
                      )
                    }
                    // onClick={() => {
                    //   setSelectedLocation(record.location);
                    //   setMapVisible(true);
                    // }}
                    disabled={
                      !record.location?.latitude || !record.location?.longitude
                    }
                  />
                </Tooltip>
                <Tooltip title="Live Tracking">
                  <Button
                    type="link"
                    size="small"
                    style={{
                      alignItems: "center",
                      fontSize: "12px",
                      height: "12px",
                    }}
                    icon={<EnvironmentOutlined />}
                    onClick={() =>
                      window.open(`/tracking/${record.raw._id}`, "_blank")
                    }
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

      <Modal
        title="Violation Location"
        open={mapVisible}
        footer={null}
        width={800}
        onCancel={() => setMapVisible(false)}
        afterOpenChange={(open) => {
          if (open && mapRef.current) {
            setTimeout(() => {
              mapRef.current.invalidateSize();
            }, 300);
          }
        }}
      >
        {selectedLocation && (
          <MapContainer
            center={[selectedLocation.latitude, selectedLocation.longitude]}
            zoom={16}
            style={{ height: "500px", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
            >
              <Popup>Violation reported here</Popup>
            </Marker>
          </MapContainer>
        )}
      </Modal>
    </>
  );
}
