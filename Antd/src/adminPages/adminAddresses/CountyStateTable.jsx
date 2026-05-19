// src/modules/Cars/CarsTable.jsx
import React, { useContext } from "react";
import { CarOutlined } from "@ant-design/icons";
import DynamicTable from "../../admin/common/DynamicTable";
import { makeService } from "../../admin/common/services";
import CountryForm from "./CountryForm.jsx";
import StateForm from "./StateForm.jsx";
import { countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { Row, Col, Flex, Table } from "antd";
import { AppContext } from "../../context/AppContext";
// import { createStyles } from "antd-style";

// const service = makeService("cars");

const countryColumns = [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => (a.company || "").localeCompare(b.company || ""),
  },

  {
    title: "Country",
    dataIndex: "cName",
    key: "cName",
    sorter: (a, b) => (a.cName || "").localeCompare(b.cName || ""),
  },
];

const stateColumns = [
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => (a.country || "").localeCompare(b.country || ""),
  },
  {
    title: "State",
    dataIndex: "stateName",
    key: "stateName",
    sorter: (a, b) => (a.stateName || "").localeCompare(b.stateName || ""),
  },
];

export default function CountryStateTable() {
  // console.log("countryService:", countryService);
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
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
        <DynamicTable
          title="Country"
          resourceName="cntry"
          columnsDef={countryColumns}
          service={countryService}
          FormComponent={CountryForm}
          transformRecord={(r) => ({
            ...r,
            company: r.companyId?.companyName || "Unknown",
          })}
          renderExpanded={(raw) => (
            <div style={{ padding: 12, lineHeight: "1.8" }}>
              <div>
                <strong>Company Name:</strong>{" "}
                {raw.companyId?.companyName || raw.companyName}
              </div>
              <div>
                <strong>Country:</strong> {raw.cName}
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
          title="State"
          resourceName="states"
          columnsDef={stateColumns}
          service={stateService}
          FormComponent={StateForm}
          canCreate={canCreate}
          canEdit={canEdit}
          canDelete={canDelete}
          canView={canView}
          canRestore={canRestore}
          transformRecord={(r) => ({
            ...r,
            country: r.countryId ? `${r.countryId.cName || ""}` : "Unknown",
          })}
          renderExpanded={(raw) => (
            <div style={{ padding: 12, lineHeight: "1.8" }}>
              <div>
                <strong>Country:</strong> {raw.countryId?.cName || raw.cName}
              </div>
              <div>
                <strong>State:</strong> {raw.stateName}
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
