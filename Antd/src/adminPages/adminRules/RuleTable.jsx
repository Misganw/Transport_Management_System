import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";

import { ruleServices } from "../../admin/common/makeServices";
import Rules from "./Rules";
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
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AppContext } from "../../context/AppContext";

// ....... END OF IMPORTING .......

const columns = [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => (a.company || "").localeCompare(b.company || ""),
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    sorter: (a, b) => (a.createdBy || "").localeCompare(b.createdBy || ""),
  },
  {
    title: "Type of Rules",
    dataIndex: "title",
    key: "title",
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  // {
  //   title: "Description",
  //   dataIndex: "description",
  //   key: "description",
  // },

  {
    title: "Created Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) =>
      createdAt ? dayjs(createdAt).format("YYYY-MM-DD") : "No Date",
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
];

export default function RuleTable() {
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
  const canView = hasRole(
    "admin",
    "manager",
    "coordinator",
    "officer",
    "passenger",
  );
  const canRestore = hasRole("admin", "manager");
  // ROLE Filteration for actions

  return (
    <>
      <DynamicTable
        title="Rules Management"
        resourceName="rules"
        columnsDef={[...columns]}
        service={ruleServices}
        FormComponent={Rules}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        canView={canView}
        canRestore={canRestore}
        transformRecord={(r) => ({
          ...r,
          company: r.companyId?.companyName || "N/A",
          createdBy: r.userId?.name || "N/A",
        })}
        renderExpanded={(raw) => (
          <div style={{ padding: 12, lineHeight: "1.8" }}>
            <div>
              <strong>Company:</strong>
              {raw.companyId?.companyName || "N/A"}
            </div>
            <div>
              <strong>Created By:</strong>
              {raw.userId?.name || "N/A"}
            </div>
            <div>
              <strong>Rule Type:</strong>
              {raw.title || "N/A"}
            </div>
            <div>
              <strong>Description:</strong> {raw.description || "N/A"}
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
