import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, Empty } from "antd";

const GaugeChart = ({
  title,
  value = 0,
  min = 0,
  max = 100,
  unit = "%",
  loading = false,
  height = 350,
  color = "#1677ff",
}) => {
  if (value === null || value === undefined) {
    return (
      <Card title={title}>
        <Empty description="No Data Available" />
      </Card>
    );
  }

  const option = {
    tooltip: {
      formatter: `{a}<br/>{b}: {c}${unit}`,
    },

    series: [
      {
        name: title,
        type: "gauge",
        min,
        max,
        progress: {
          show: true,
          width: 18,
        },

        axisLine: {
          lineStyle: {
            width: 18,
          },
        },

        pointer: {
          width: 6,
        },

        axisTick: {
          distance: -18,
        },

        splitLine: {
          distance: -18,
          length: 15,
        },

        axisLabel: {
          distance: 25,
        },

        detail: {
          valueAnimation: true,
          formatter: `{value}${unit}`,
          fontSize: 26,
          color,
        },

        data: [
          {
            value,
            name: title,
          },
        ],
      },
    ],
  };

  return (
    <Card
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

export default GaugeChart;
