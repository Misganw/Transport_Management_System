import React from "react";
import { Card, Statistic, Typography, Space, Divider, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
const { Text } = Typography;
const StatisticCard = ({
  title,
  value,
  subtitle,
  footer,
  trend,
  suffix,
  prefix,
  precision = 0,
  loading = false,
}) => {
  const positive = trend >= 0;

  return (
    <Card
      loading={loading}
      size="small"
      style={{
        borderRadius: 12,
        height: "100%",
      }}
    >
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Text type="secondary">{title}</Text>

        <Statistic
          value={value}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
        />

        {subtitle && <Text type="secondary">{subtitle}</Text>}

        {trend !== undefined && (
          <Tag color={positive ? "green" : "red"}>
            {positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
            {Math.abs(trend)}%
          </Tag>
        )}

        {footer && (
          <>
            <Divider
              style={{
                margin: "8px 0",
              }}
            />

            <Text>{footer}</Text>
          </>
        )}
      </Space>
    </Card>
  );
};

export default StatisticCard;
