import React, { useState, useEffect } from "react";
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

  return (
    <>
      <DynamicTable
        title="Rules Management"
        resourceName="rules"
        columnsDef={[...columns]}
        service={ruleServices}
        FormComponent={Rules}
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
