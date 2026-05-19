// src/modules/Cars/CarsTable.jsx
import React, { useContext } from "react";
import { CarOutlined } from "@ant-design/icons";
import DynamicTable from "../../admin/common/DynamicTable";
import { makeService } from "../../admin/common/services";
import CountryForm from "./CountryForm.jsx";
import StateForm from "./StateForm.jsx";
import ZoneForm from "./ZoneForm.jsx";
import WeredaForm from "./WeredaForm.jsx";
import { countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { zoneService } from "../../admin/common/makeServices";
import { weredaService } from "../../admin/common/makeServices";
import { Row, Col, Flex, Table } from "antd";
import { AppContext } from "../../context/AppContext";
// import { createStyles } from "antd-style";

// const service = makeService("cars");

const weredaColumns = [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => (a.company || "").localeCompare(b.company || ""),
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => (a.country || "").localeCompare(b.country || ""),
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
    sorter: (a, b) => (a.state || "").localeCompare(b.state || ""),
  },

  {
    title: "Zone",
    dataIndex: "zoneName",
    key: "zoneName",
    sorter: (a, b) => (a.zoneName || "").localeCompare(b.zoneName || ""),
  },
  {
    title: "Wereda",
    dataIndex: "weredaName",
    key: "weredaName",
    sorter: (a, b) => (a.weredaName || "").localeCompare(b.weredaName || ""),
  },
];

export default function WeredaTable() {
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
    // <Row gutter={16}>
    //   <Col xs={24} sm={24} md={24} lg={12} xl={12}>
    <DynamicTable
      title="Wereda"
      resourceName="weredas"
      columnsDef={weredaColumns}
      service={weredaService}
      FormComponent={WeredaForm}
      canCreate={canCreate}
      canEdit={canEdit}
      canDelete={canDelete}
      canView={canView}
      canRestore={canRestore}
      transformRecord={(r) => ({
        ...r,
        zone: r.zoneId?.zoneName || "Unknown",
        state: r.zoneId?.stateId?.stateName || "Unknown",
        country: r.zoneId?.stateId?.countryId?.cName || "Unknown",
        company:
          r.zoneId?.stateId?.countryId?.companyId.companyName || "Unknown",
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong>Wereda Name:</strong> {raw.weredaName}
          </div>
          <div>
            <strong>Zone Name:</strong> {raw.zoneId?.zoneName}
          </div>
          <div>
            <strong>State Name:</strong> {raw.zoneId?.stateId?.stateName}
          </div>
          <div>
            <strong>Country Name:</strong>{" "}
            {raw.zoneId?.stateId?.countryId?.cName}
          </div>
          <div>
            <strong>Company Name:</strong>{" "}
            {raw.zoneId?.stateId?.countryId?.companyId?.companyName}
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
    //   </Col>
    // </Row>
  );
}
