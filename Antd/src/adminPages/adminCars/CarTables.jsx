// src/modules/Cars/CarsTable.jsx
import React from "react";
import { CarOutlined } from "@ant-design/icons";
import DynamicTable from "../../admin/common/DynamicTable";
import { makeService } from "../../admin/common/services";
import CarsForm from "./CarForms";
import { carServices } from "../../admin/common/makeServices";

// const service = makeService("cars");

const columns = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    sorter: (a, b) => (a.owner || "").localeCompare(b.owner || ""),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
  },
  {
    title: "Model",
    dataIndex: "model",
    key: "model",
    sorter: (a, b) => (a.model || "").localeCompare(b.model || ""),
  },
  {
    title: "Plate",
    dataIndex: "plateNumber",
    key: "plateNumber",
    sorter: (a, b) => (a.plateNumber || "").localeCompare(b.plateNumber || ""),
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    sorter: (a, b) => (a.level || "").localeCompare(b.level || ""),
    filters: [
      { text: "Standard", value: "Standard" },
      { text: "Premium", value: "Premium" },
    ],
    onFilter: (value, record) => record.level === value,
  },
  {
    title: "Seats",
    dataIndex: "NoofSeats",
    key: "NoofSeats",
    sorter: (a, b) => (a.NoofSeats || "").localeCompare(b.NoofSeats || ""),
  },
];

export default function CarsTable() {
  return (
    <DynamicTable
      title="Cars"
      resourceName="cars"
      columnsDef={columns}
      service={carServices}
      FormComponent={CarsForm}
      transformRecord={(r) => ({
        ...r,
        owner: r.ownerId
          ? `${r.ownerId.fName} ${r.ownerId.lName || ""}`
          : "Unknown",
        company: r.companyId?.companyName || r.companyName || "Unknown",
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong>Company Name:</strong>{" "}
            {raw.companyId?.companyName || raw.companyName}
          </div>
          <div>
            <strong>Owner:</strong> {raw.ownerId.fName} {raw.ownerId.lName}
          </div>
          <div>
            <strong>Type:</strong> {raw.type}
          </div>
          <div>
            <strong>Model:</strong> {raw.model}
          </div>
          <div>
            <strong>Plate Number:</strong> {raw.plateNumber}
          </div>
          <div>
            <strong>Level:</strong> {raw.level}
          </div>
          <div>
            <strong>Seats:</strong> {raw.NoofSeats}
          </div>
          <div>
            <strong>Value:</strong> {raw.value}
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
