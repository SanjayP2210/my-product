import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { formatToINR } from "../../constants/utilities";

const TotalIncomeLineChart = ({chartValues}) => {
  let chart = null;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug","Sep", "Oct", "Nov", "Dec"];
  const chartRef  = useRef(null);
  const [chartElement, setChartElement] = useState(null)
  let chartOptions = {
    series: [
      // {
      //   name: "2022",
      //   data: [50, 60, 30, 55, 75, 60, 100, 120],
      // },

      // {
      //   name: "2023",
      //   data: [35, 45, 40, 50, 35, 55, 40, 45],
      // },
      // {
      //   name: "2024",
      //   data: [100, 75, 80, 40, 20, 40, 0, 25],
      // },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      type: "area",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 300,
      width: "100%",
      stacked: false,
      offsetX: -10,
    },
    colors: ["var(--bs-primary)", "var(--bs-secondary)", "var(--bs-danger)"],
    plotOptions: {},
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top", 
    },
    stroke: {
      width: 2,
      curve: "monotoneCubic",
    },
    grid: {
      show: true,
      padding: {
        top: 0,
        bottom: 0,
      },
      borderColor: "rgba(0,0,0,0.05)",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacityTo: 0.01,
        stops: [0, 100],
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      // categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug"],
    },
    markers: {
      strokeColor: [
        "var(--bs-danger)",
        "var(--bs-secondary)",
        "var(--bs-primary)",
      ],
      strokeWidth: 2,
    },
    tooltip: {
      theme: "dark",
      x: {
        formatter: (value) => {
          return months[parseInt(value) - 1] // Format tooltip to show month names
        }
      }
    },
  };
  useEffect(() => {
    chart = new ApexCharts(
      document.querySelector("#revenue-forecast"),
      chartOptions
    );
    chart.render();
    setChartElement(chart);
  }, []);

  useEffect(() => {
    if (chartValues?.series?.length > 0 && chartElement) {
      let highestIncome = 0;
      chartValues.series.map((item)=>{
        item.data.forEach(data => {
          if (data > highestIncome) {
            highestIncome = data;
        }
        });
      })
      // Update options
    chartElement.updateOptions({
            options : {
                ...chartOptions,
            },
            legend: {
              show: true,
              position: "top", 
            },
            xaxis: {
              categories : chartValues?.categories
            },
            yaxis: {
              // labels: {
              //     formatter: (value) => `${formatToINR(value)}` // Format Y-axis values
              // },
              min: 0, // Set minimum value
              tickAmount: 5, // Number of ticks on the Y-axis (optional)
              max: highestIncome > 0 ? highestIncome + (highestIncome/10) : 0 
          },
            ...chartValues
        });
    }
  }, [chartValues.series]);
  

  return (
    <>
      <div className="d-md-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="card-title">
         Monthly Total Income
    </h5>
        </div>
      </div>
      <div style={{ height: "305px" }} className="me-n2 rounded-bars">
        <div id="revenue-forecast" ref={chartRef}></div>
      </div>
    </>
  );
};

export default TotalIncomeLineChart;
