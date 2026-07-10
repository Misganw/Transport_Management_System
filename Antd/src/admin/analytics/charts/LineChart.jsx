import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, Empty } from "antd";

const LineChart = ({
  title,
  subtitle = "",
  categories = [],
  series = [],
  loading = false,
  height = 380,
  smooth = true,
  showSymbol = true,
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
      top: 40,
    },

    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
        restore: {},
        dataZoom: {},
      },
    },

    dataZoom: [
      {
        type: "inside",
      },

      {
        type: "slider",
      },
    ],

    grid: {
      left: 60,
      right: 30,
      bottom: 70,
      top: 80,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
    },
    yAxis: {
      type: "value",
    },

    series: series.map((item) => ({
      ...item,
      type: "line",
      smooth,
      showSymbol,
      symbol: "circle",
      symbolSize: 8,
      lineStyle: {
        width: 3,
      },

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
        notMerge={false} // ADD THIS: Keeps internal instance state alive (like dataZoom state)
        lazyUpdate={true} // ADD THIS: Throttles re-draws for smoother UI feedbac
        style={{
          height,
          width: "100%",
        }}
      />
    </Card>
  );
};

export default LineChart;
