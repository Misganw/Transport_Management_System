import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, Empty } from "antd";

const PieChart = ({
  title,
  data = [],
  height = 350,
  donut = true,
  showLegend = true,
  loading = false,
}) => {
  if (!data.length) {
    return (
      <Card title={title}>
        <Empty description="No Data" />
      </Card>
    );
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c} ({d}%)",
    },

    legend: showLegend
      ? {
          orient: "horizontal",
          bottom: 0,
        }
      : null,

    series: [
      {
        name: title,
        type: "pie",
        radius: donut ? ["45%", "70%"] : "70%",
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },

        label: {
          show: true,
          formatter: "{b}\n{d}%",
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        data,
      },
    ],
  };

  return (
    <Card
      title={title}
      loading={loading}
      style={{
        borderRadius: 10,
      }}
    >
      <ReactECharts
        option={option}
        style={{
          height,
          width: "100%",
        }}
      />
    </Card>
  );
};

export default PieChart;
