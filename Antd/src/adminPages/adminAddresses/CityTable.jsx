// src/modules/Cars/CarsTable.jsx
import React from "react";
import { CarOutlined } from "@ant-design/icons";
import DynamicTable from "../../admin/common/DynamicTable";
import { makeService } from "../../admin/common/services";
import CountryForm from "./CountryForm.jsx";
import StateForm from "./StateForm.jsx";
import ZoneForm from "./ZoneForm.jsx";
import CityForm from "./CityForm.jsx";
import { cityService, countryService } from "../../admin/common/makeServices";
import { stateService } from "../../admin/common/makeServices";
import { zoneService } from "../../admin/common/makeServices";
import { weredaService } from "../../admin/common/makeServices";
import { Row, Col, Flex, Table } from "antd";
// import { createStyles } from "antd-style";

// const service = makeService("cars");

const cityColumns = [
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
    dataIndex: "zone",
    key: "zone",
    sorter: (a, b) => (a.zone || "").localeCompare(b.zone || ""),
  },
  {
    title: "Wereda",
    dataIndex: "wereda",
    key: "wereda",
    sorter: (a, b) => (a.wereda || "").localeCompare(b.wereda || ""),
  },
  {
    title: "City",
    dataIndex: "cityName",
    key: "cityName",
    sorter: (a, b) => (a.cityName || "").localeCompare(b.cityName || ""),
  },
];

export default function CityTable() {
  return (
    // <Row gutter={16}>
    //   <Col xs={24} sm={24} md={24} lg={12} xl={12}>
    <DynamicTable
      title="Cities"
      resourceName="cities"
      columnsDef={cityColumns}
      service={cityService}
      FormComponent={CityForm}
      transformRecord={(r) => ({
        ...r,
        wereda: r.weredaId?.weredaName || "Unknown",
        zone: r.weredaId?.zoneId?.zoneName || "Unknown",
        state: r.weredaId?.zoneId?.stateId?.stateName || "Unknown",
        country: r.weredaId?.zoneId?.stateId?.countryId?.cName || "Unknown",
        company:
          r.weredaId?.zoneId?.stateId?.countryId?.companyId.companyName ||
          "Unknown",
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong>City Name:</strong> {raw.cityName}
          </div>

          <div>
            <strong>Wereda Name:</strong> {raw.weredaId?.weredaName}
          </div>
          <div>
            <strong>Zone Name:</strong> {raw.weredaId?.zoneId?.zoneName}
          </div>
          <div>
            <strong>State Name:</strong>{" "}
            {raw.weredaId?.zoneId?.stateId?.stateName}
          </div>
          <div>
            <strong>Country Name:</strong>{" "}
            {raw.weredaId?.zoneId?.stateId?.countryId?.cName}
          </div>
          <div>
            <strong>Company Name:</strong>{" "}
            {raw.weredaId?.zoneId?.stateId?.countryId?.companyId?.companyName}
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
