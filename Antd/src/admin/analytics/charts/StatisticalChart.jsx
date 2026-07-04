import React from "react";
import { Card, Statistic, Typography, Space } from "antd";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const StatisticCard = ({
  title,
  value,
  precision = 0,
  prefix,
  suffix,
  icon,
  trend = "up",
  percentage = 0,
  comparison = "Compared with last month",
  loading = false,
  color = "#1677ff",
}) => {
  const positive = trend === "up";

  return (
    <Card
      loading={loading}
      hoverable
      style={{
        borderRadius: 12,
        height: "100%",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text strong>{title}</Text>
          {icon}
        </Space>
        <Statistic
          value={value}
          precision={precision}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{
            color,
          }}
        />
        <Space>
          {positive ? (
            <ArrowUpOutlined
              style={{
                color: "#52c41a",
              }}
            />
          ) : (
            <ArrowDownOutlined
              style={{
                color: "#ff4d4f",
              }}
            />
          )}

          <Text
            style={{
              color: positive ? "#52c41a" : "#ff4d4f",
            }}
          >
            {percentage}%
          </Text>
        </Space>

        <Text type="secondary">{comparison}</Text>
      </Space>
    </Card>
  );
};

export default StatisticCard;
