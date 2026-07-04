import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, Empty } from "antd";

const BarChart = ({
  title,
  subtitle = "",
  height = 380,
  loading = false,
  // x-axis labels
  categories = [],
  // one or many series
  series = [],
  horizontal = false,
}) => {
  if (!categories.length || !series.length) {
    return (
      <Card title={title}>
        <Empty description="No Data Available" />
      </Card>
    );
  }

  const option = {
    title: {
      text: title,
      subtext: subtitle,
      left: "center",
    },

    tooltip: {
      trigger: "axis",
    },

    legend: {
      top: 30,
    },

    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
        restore: {},
        dataZoom: {},
      },
    },

    grid: {
      left: 60,
      right: 30,
      bottom: 60,
      top: 80,
      containLabel: true,
    },

    xAxis: horizontal
      ? {
          type: "value",
        }
      : {
          type: "category",
          data: categories,
        },

    yAxis: horizontal
      ? {
          type: "category",
          data: categories,
        }
      : {
          type: "value",
        },

    series: series.map((item) => ({
      ...item,
      type: "bar",
      barMaxWidth: 40,
      emphasis: {
        focus: "series",
      },
    })),
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

export default BarChart;
