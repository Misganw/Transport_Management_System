import React from "react";
import {
  Row,
  Col,
  Space,
  Select,
  DatePicker,
  Button,
  Input,
  Dropdown,
  Tooltip,
} from "antd";

import {
  ReloadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsToolbar = ({ filters, setFilters, onRefresh, onExport }) => {
  const exportItems = [
    {
      key: "excel",
      label: "Export to Excel",
    },
    {
      key: "pdf",
      label: "Export to PDF",
    },
    {
      key: "csv",
      label: "Export to CSV",
    },
  ];

  return (
    <Row gutter={[16, 16]} align="middle">
      {/* Date */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <RangePicker
          style={{ width: "100%" }}
          onChange={(value) =>
            setFilters({
              ...filters,
              dateRange: value,
            })
          }
        />
      </Col>

      {/* Company */}
      <Col xs={24} sm={12} md={8} lg={4}>
        <Select
          value={filters.company}
          style={{ width: "100%" }}
          onChange={(value) =>
            setFilters({
              ...filters,
              company: value,
            })
          }
        >
          <Option value="all">All Companies</Option>
        </Select>
      </Col>

      {/* Route */}
      <Col xs={24} sm={12} md={8} lg={4}>
        <Select
          value={filters.route}
          style={{ width: "100%" }}
          onChange={(value) =>
            setFilters({
              ...filters,
              route: value,
            })
          }
        >
          <Option value="all">All Routes</Option>
        </Select>
      </Col>

      {/* Driver */}
      <Col xs={24} sm={12} md={8} lg={4}>
        <Select
          value={filters.driver}
          style={{ width: "100%" }}
          onChange={(value) =>
            setFilters({
              ...filters,
              driver: value,
            })
          }
        >
          <Option value="all">All Drivers</Option>
        </Select>
      </Col>

      {/* Search */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Input prefix={<SearchOutlined />} placeholder="Search..." />
      </Col>

      {/* Buttons */}
      <Col span={24}>
        <Space wrap>
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Refresh
            </Button>
          </Tooltip>

          <Dropdown
            menu={{
              items: exportItems,
              onClick: ({ key }) => onExport(key),
            }}
          >
            <Button icon={<DownloadOutlined />}>Export</Button>
          </Dropdown>

          <Tooltip title="Fullscreen">
            <Button icon={<FullscreenOutlined />} />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
};

export default AnalyticsToolbar;
