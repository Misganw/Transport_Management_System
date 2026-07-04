import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, Empty } from "antd";

const HeatMap = ({
  title,
  loading = false,
  height = 450,
  xLabels = [],
  yLabels = [],
  data = [],
}) => {
  if (!xLabels.length || !yLabels.length || !data.length) {
    return (
      <Card title={title}>
        <Empty description="No Data Available" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[2]));

  const option = {
    tooltip: {
      position: "top",
    },

    grid: {
      top: 70,
      left: 100,
      right: 30,
      bottom: 60,
    },

    xAxis: {
      type: "category",
      data: xLabels,
      splitArea: {
        show: true,
      },
    },

    yAxis: {
      type: "category",
      data: yLabels,
      splitArea: {
        show: true,
      },
    },

    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 10,
    },

    series: [
      {
        name: title,
        type: "heatmap",
        data,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,.4)",
          },
        },
      },
    ],
  };

  return (
    <Card
      loading={loading}
      title={title}
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

export default HeatMap;
