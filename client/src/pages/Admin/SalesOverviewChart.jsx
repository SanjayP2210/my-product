import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts'


const SalesOverviewChart = () => {
    useEffect(() => {
        var options = {
            series: [50, 80, 30],
            labels: ["36%", "10%", "36%"],
            chart: {
                type: "radialBar",
                height: 230,
                fontFamily: "inherit",
                foreColor: "#c6d1e9",
            },
            plotOptions: {
                radialBar: {
                    inverseOrder: false,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 1,
                        size: "40%",
                    },
                    dataLabels: {
                        show: false,
                    },
                },
            },
            legend: {
                show: false,
            },
            stroke: { width: 1, lineCap: "round" },
            tooltip: {
                enabled: false,
                fillSeriesColor: false,
            },
            colors: ["var(--bs-primary)", "var(--bs-secondary)", "var(--bs-danger)"],
        };
    
        var chart = new ApexCharts(
            document.querySelector("#sales-overview"),
            options
        );
        chart.render();
    }, [])
    
  return (
    <div className="card">
    <div className="card-body">
      <h5 className="card-title fw-semibold">Sales Overview</h5>
      <p className="card-subtitle mb-1">Last 7 days</p>

      <div className="position-relative labels-chart">
        <span className="fs-11 label-1">0%</span>
        <span className="fs-11 label-2">25%</span>
        <span className="fs-11 label-3">50%</span>
        <span className="fs-11 label-4">75%</span>
        <div id="sales-overview"></div>
      </div>
    </div>
  </div>
  )
}

export default SalesOverviewChart