import React from "react";
import { Card, Progress, Empty } from "antd";

const ProgressChart = ({
  title,
  loading = false,

  // array of progress items
  data = [
    // { label: "Tickets Paid", value: 70, color: "#1677ff" }
  ],
}) => {
  if (!data.length) {
    return (
      <Card title={title} loading={loading}>
        <Empty description="No Progress Data" />
      </Card>
    );
  }

  return (
    <Card
      title={title}
      loading={loading}
      style={{
        borderRadius: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {data.map((item, index) => (
          <div key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontWeight: 500 }}>{item.label}</span>
              <span>{item.value}%</span>
            </div>

            <Progress
              percent={item.value}
              strokeColor={item.color || "#1677ff"}
              status={item.status || "active"}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressChart;
