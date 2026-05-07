// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import SubroutForm from "./SubroutForm";
import { Avatar } from "antd";
import { subRoutServices } from "../../admin/common/makeServices";
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";

// const service = makeService("employees");

const columns = [
  {
    title: "Main Routs",
    dataIndex: "rout",
    key: "rout",
    sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
  },
  {
    title: "Subroutes",
    dataIndex: "subrout",
    key: "subrout",
    sorter: (a, b) => (a.subrout || "").localeCompare(b.subrout || ""),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
  },
];

export default function subRoutTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  return (
    <DynamicTable
      title="Sub Rout"
      resourceName="subrouts"
      columnsDef={columns}
      service={subRoutServices}
      FormComponent={SubroutForm}
      transformRecord={(r) => ({
        ...r,
        rout: `${r.routId?.departure || ""} - ${r.routId?.arrival || ""}`.trim(),
        subrout: `${r.subdeparture || ""} - ${r.subarrival || ""}`.trim(),
        email: r.userId?.email || "N/A",
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong> Sub rout Assigned By</strong>{" "}
            {raw.userId ? `${raw.userId.name || ""}` : "N/A"}
          </div>
          <div>
            <strong> Main Route:</strong> {raw.routId?.departure || "N/A"} -{" "}
            {raw.routId?.arrival || "N/A"}
          </div>
          <div>
            <strong> Specific Rout:</strong> {raw.subdeparture || "N/A"} -{" "}
            {raw.subarrival || "N/A"}
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
