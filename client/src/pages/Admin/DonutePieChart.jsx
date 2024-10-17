import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

const DonutePieChart = ({ donultChartOptions }) => {
  const chartRef = useRef();
  const [chartSeries, setChartSeries] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  let options = null;
  useEffect(() => {
    if (donultChartOptions?.series) {
      options = {
        chart: {
          fontFamily: "inherit",
          type: "donut",
          width: 385,
        },
        colors: [
          "var(--bs-primary)",
          "var(--bs-secondary)",
          "#ffae1f",
          "#fa896b",
          "#39b69a",
        ],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
      setChartSeries(donultChartOptions.series || []);
      setChartLabels(donultChartOptions.labels || []);
    }
  }, [donultChartOptions?.series]);

  const getLegends = {
      labels: {
        colors: "#a1aab2",
      },
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      fontFamily: "Arial, sans-serif",
      fontWeight: 600,
      formatter: (val, opts) => {
        const index = opts.seriesIndex;
        const value = opts.w.config.series[index];
        return `${val}: ${value}`;
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    };

  return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Stock Chart</h4>
          {chartSeries && (
            <div ref={chartRef}>
              <ReactApexChart
                options={{
                  ...options,
                  labels: chartLabels,
                  legend: getLegends,
                }}
                series={chartSeries}
                type="donut"
              />
            </div>
          )}
        </div>
      </div>
  );
};

export default DonutePieChart;
