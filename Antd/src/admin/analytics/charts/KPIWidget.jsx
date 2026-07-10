import React from "react";

import { Card, Statistic, Space, Typography, Tag, Tooltip } from "antd";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const KPIWidget = ({
  title,
  value,
  icon,
  color = "#1677ff",
  loading = false,
  suffix,
  prefix,
  trend,
  precision = 0,
  onClick,
}) => {
  const positive = trend >= 0;

  return (
    <Card
      hoverable
      loading={loading}
      onClick={onClick}
      style={{
        fontSize: 10,
        padding: 0,
        borderRadius: 12,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "0.3s",
      }}
    >
      <Space
        direction="vertical"
        size={1}
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            padding: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary" strong>
            {title}
          </Text>

          <div
            style={{
              fontSize: 15,
              color,
            }}
          >
            {icon}
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Statistic
            style={{ fontSize: 10 }}
            value={value}
            precision={precision}
            prefix={prefix}
            suffix={suffix}
          />

          {trend !== undefined && (
            <Tooltip title="Compared to previous period">
              <Tag color={positive ? "green" : "red"}>
                {positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                {Math.abs(trend)}%
              </Tag>
            </Tooltip>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default KPIWidget;
