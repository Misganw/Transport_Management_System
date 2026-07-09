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
        padding: 5,
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
              fontSize: 30,
              color,
            }}
          >
            {icon}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Statistic
            value={value}
            precision={precision}
            prefix={prefix}
            suffix={suffix}
            styles={{ Size: "12px" }}
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
