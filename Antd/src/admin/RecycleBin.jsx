// src/modules/recycleBin/RecycleBin.jsx
import { Table, Button, Space, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { recycleBinService } from "./common/makeServices.js";
import "./css/Admin.css";
import "./css/AdminPage.css";
import DynamicTable from "./common/DynamicTable.jsx";
import { Tag } from "antd";
import { toast } from "react-toastify";

const columns = [
  {
    title: "Collection",
    dataIndex: "collectionName",
    key: "collectionName",
    sorter: (a, b) =>
      (a.collectionName || "").localeCompare(b.collectionName || ""),
    render: (v) => <Tag color="volcano">{v}</Tag>,
  },
  {
    title: "Original ID",
    dataIndex: "originalId",
    key: "originalId",
  },
  {
    title: "Deleted By",
    dataIndex: "deletedBy",
    key: "deletedBy",
  },
  {
    title: "Deleted At",
    dataIndex: "deletedAt",
    key: "deletedAt",
    sorter: (a, b) => new Date(a.deletedAt) - new Date(b.deletedAt),
    render: (v) => new Date(v).toLocaleString(),
  },
];

export default function RecycleBin() {
  return (
    <DynamicTable
      title="Recycle Bin"
      resourceName="recycleBin"
      columnsDef={columns}
      service={recycleBinService}
      /*  Disable create & edit */
      hideCreate
      hideEdit
      /* Replace delete with restore */
      deleteLabel="Restore"
      onRestore={async (id) => {
        await recycleBinService.restore(id);
      }}
      /* 🔄 Bulk restore */
      onRestoreMany={async (ids) => {
        const res = await recycleBinService.restoreMany(ids);
        const { restored, skipped } = res.data;
        if (restored > 0 && skipped.length === 0) {
          toast.success(`${restored} record(s) restored successfully`);
        } else if (restored > 0 && skipped.length > 0) {
          toast.warning(
            `Restored ${restored} record(s), skipped ${skipped.length} duplicate(s)`
          );
        } else {
          toast.info("All selected records already exist. Nothing restored.");
        }
      }}
      /* Optional: expand to show original data */
      renderExpanded={(raw) => (
        <pre
          style={{
            background: "#f5f5f5",
            padding: 12,
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          {JSON.stringify(raw.data, null, 2)}
        </pre>
      )}
    />
  );
}
