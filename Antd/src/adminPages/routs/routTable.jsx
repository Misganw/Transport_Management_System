// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "../../admin/common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import RoutForm from "./RoutForm";
import TarrifForm from "./TarrifForm";
import { Avatar, Row, Col } from "antd";
import { routService, tarrifService } from "../../admin/common/makeServices";
import "../../admin/css/Admin.css";
import "../../admin/css/AdminPage.css";
import { AppContext } from "../../context/AppContext";

// const service = makeService("employees");

const columns = [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => (a.company || "").localeCompare(b.company || ""),
  },
  {
    title: "Deparuture City",
    dataIndex: "departure",
    key: "departure",
    sorter: (a, b) => (a.departure || "").localeCompare(b.departure || ""),
  },
  {
    title: "Arrival City",
    dataIndex: "arrival",
    key: "arrival",
    sorter: (a, b) => (a.arrival || "").localeCompare(b.arrival || ""),
  },
];

const columnsTarrif = [
  {
    title: "Route",
    dataIndex: "rout",
    key: "rout",
    sorter: (a, b) => (a.rout || "").localeCompare(b.rout || ""),
  },
  {
    title: "Care Type",
    dataIndex: "carType",
    key: "carType",
    sorter: (a, b) => (a.carType || "").localeCompare(b.carType || ""),
  },
  {
    title: "Care Level",
    dataIndex: "carLevel",
    key: "carLevel",
    sorter: (a, b) => (a.carLevel || "").localeCompare(b.carLevel || ""),
  },
  {
    title: "Price in Birr",
    dataIndex: "amount",
    key: "amount",
    sorter: (a, b) => a.amount - b.amount,
  },
];

export default function RoutTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ROLE Filteration for actions
  const rawRoles = useContext(AppContext)?.userData?.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];
  const hasRole = (...allowedRoles) => {
    return roles.some((r) => allowedRoles.includes(r));
  };
  const canCreate = hasRole("admin", "manager");
  const canEdit = hasRole("admin", "manager", "coordinator");
  const canDelete = hasRole("admin", "manager", "coordinator");
  const canView = hasRole("admin", "manager", "coordinator", "officer");
  const canRestore = hasRole("admin", "manager", "coordinator");
  // ROLE Filteration for actions

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
        <DynamicTable
          title="Routs"
          resourceName="routs"
          columnsDef={columns}
          service={routService}
          FormComponent={RoutForm}
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          canView={canView}
          canRestore={canRestore}
          transformRecord={(r) => ({
            ...r,
            departure: r.departure,
            arrival: r.arrival,
            company: r.companyId ? r.companyId?.companyName : "Unknown",
          })}
          renderExpanded={(raw) => (
            <div style={{ padding: 12, lineHeight: "1.8" }}>
              <div>
                <strong> Departure:</strong> {raw.departure}
              </div>
              <div>
                <strong> Arrival:</strong> {raw.arrival}
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
      </Col>

      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
        <DynamicTable
          title="Tariffs"
          resourceName="tarrifs"
          columnsDef={columnsTarrif}
          service={tarrifService}
          FormComponent={TarrifForm}
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          canView={canView}
          canRestore={canRestore}
          transformRecord={(r) => ({
            ...r,
            rout: `${r.routId?.departure || "Unknown"} -> ${
              r.routId?.arrival || "Unknown"
            }`.trim(),
            carType: r.carId ? `${r.carId?.type || ""}` : "Unknown",
            carLevel: r.carId ? `${r.carId?.level || ""}` : "Unknown",
          })}
          renderExpanded={(raw) => (
            <div style={{ padding: 12, lineHeight: "1.8" }}>
              <div>
                <strong>Rout:</strong>
                {raw.routId?.departure || raw.departure} {"->"}{" "}
                {raw.routId?.arrival || raw.arrival}
              </div>
              <div>
                <strong>Car Type:</strong>
                {raw.carId?.type || raw.carId.type}
              </div>
              <div>
                <strong>Level:</strong>
                {raw.carId?.level || raw.carId.level}
              </div>
              <div>
                <strong>Amount in Birr:</strong> {raw.amount}
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
      </Col>
    </Row>
  );
}
