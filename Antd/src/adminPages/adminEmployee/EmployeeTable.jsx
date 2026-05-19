// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import EmployeeForm from "./EmployeeForm";
import { Avatar } from "antd";
import {
  employeeServices,
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
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
    sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    sorter: (a, b) => (a.gender || "").localeCompare(b.gender || ""),
  },
  {
    title: "RID(SSID)",
    dataIndex: "RID",
    key: "RID",
    sorter: (a, b) => (a.RID || "").localeCompare(b.RID || ""),
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    filters: [
      { text: "Standard", value: "Standard" },
      { text: "Premium", value: "Premium" },
    ],
    onFilter: (value, record) => record.level === value,
  },
  {
    title: "Mobile #",
    dataIndex: "phone",
    key: "phone",
    sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
  },
];

export default function EmployeeTable() {
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
      title="employees"
      resourceName="employees"
      columnsDef={columns}
      service={employeeServices}
      FormComponent={EmployeeForm}
      canCreate={canCreate}
      canEdit={canEdit}
      canDelete={canDelete}
      canView={canView}
      canRestore={canRestore}
      transformRecord={(r) => ({
        ...r,
        fullName: `${r.fName || ""} | ${r.mName || ""} | ${
          r.lName || ""
        }`.trim(),
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong> First Name:</strong> {raw.fName}
          </div>
          <div>
            <strong> Middle Name:</strong> {raw.mName}
          </div>
          <div>
            <strong> Last Name:</strong> {raw.lName}
          </div>
          <div>
            <strong>Age:</strong> {raw.age}
          </div>
          <div>
            <strong>Gender:</strong> {raw.gender}
          </div>
          <div>
            <strong>RID (SSID):</strong> {raw.RID}
          </div>
          <div>
            <strong>Position:</strong> {raw.position}
          </div>
          <div>
            <strong>Experience:</strong> {raw.exprience}
          </div>
          <div>
            <strong>Department:</strong> {raw.department}
          </div>
          <div>
            <Avatar
              size={40}
              src={backendURL + raw?.profileImage}
              className="profile-trigger"
            />
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
