// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import PoliceAssignForm from "./PoliceAssignForm";
import { Avatar } from "antd";
import {
  PoliceAssignmentServices,
  countryService,
  stateService,
  zoneService,
  weredaService,
  cityService,
} from "../../admin/common/makeServices";
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";
import { AppContext } from "../../context/AppContext";

// const service = makeService("employees");

const columns = [
  {
    title: "Police Name",
    dataIndex: "fullName",
    key: "fullName",
    sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
  },
  {
    title: "Rout",
    dataIndex: "rout",
    key: "rout",
    sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
  },
  {
    title: "Subroute",
    dataIndex: "subrout",
    key: "subrout",
    sorter: (a, b) => (a.subrout || "").localeCompare(b.subrout || ""),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
  },
  {
    title: "Detail",
    dataIndex: "details",
    key: "details",
    sorter: (a, b) => (a.details || "").localeCompare(b.details || ""),
  },
  {
    title: "Assigned Date",
    dataIndex: "assignmentDate",
    key: "assignmentDate",
    sorter: (a, b) =>
      (a.assignmentDate || "").localeCompare(b.assignmentDate || ""),
  },
];

export default function AssignPoliceTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ROLE Filteration for actions
  const rawRoles = useContext(AppContext)?.userData?.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];
  const hasRole = (...allowedRoles) => {
    return roles.some((r) => allowedRoles.includes(r));
  };
  const canCreate = hasRole("admin", "manager");
  const canEdit = hasRole("admin", "manager");
  const canDelete = hasRole("admin", "manager");
  const canView = hasRole("admin", "manager");
  const canRestore = hasRole("admin", "manager");
  // ROLE Filteration for actions
  return (
    <DynamicTable
      title="Assigned Police"
      resourceName="policeAssignment"
      columnsDef={columns}
      service={PoliceAssignmentServices}
      FormComponent={PoliceAssignForm}
      canCreate={canCreate}
      canEdit={canEdit}
      canDelete={canDelete}
      canView={canView}
      canRestore={canRestore}
      transformRecord={(r) => ({
        ...r,
        fullName:
          `${r.trafficOfficerId?.fName || ""} | ${r.trafficOfficerId?.mName || ""} | ${
            r.trafficOfficerId?.lName || ""
          }`.trim(),
        rout: `${r.subrouteId?.routId?.departure || ""} - ${r.subrouteId?.routId?.arrival || ""}`.trim(),
        subrout:
          `${r.subrouteId?.subdeparture || ""} - ${r.subrouteId?.subarrival || ""}`.trim(),
        phone: r.trafficOfficerId?.phone || "N/A",
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong> Full Name:</strong>{" "}
            {raw.trafficOfficerId
              ? `${raw.trafficOfficerId.fName || ""} | ${
                  raw.trafficOfficerId.mName || ""
                } | ${raw.trafficOfficerId.lName || ""}`.trim()
              : "N/A"}
          </div>
          <div>
            <strong> Assigned Route:</strong>{" "}
            {raw.subrouteId?.routId?.departure || "N/A"} -{" "}
            {raw.subrouteId?.routId?.arrival || "N/A"}
          </div>
          <div>
            <strong> Specific Place:</strong>{" "}
            {raw.subrouteId?.subdeparture || "N/A"} -{" "}
            {raw.subrouteId?.subarrival || "N/A"}
          </div>
          <div>
            <strong> Detail:</strong> {raw.detail || "N/A"}
          </div>
          <div>
            <strong>Assigned Date:</strong>{" "}
            {new Date(raw.assignmentDate).toLocaleString()}
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
  );
}
