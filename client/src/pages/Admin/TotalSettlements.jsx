import React, { useEffect } from 'react'
import { Icon } from "@iconify/react";
import ApexCharts from 'apexcharts'

const TotalSettlements = () => {
    useEffect(() => {
        var settlements = {
            series: [
                {
                    name: "settlements",
                    data: [
                        40, 40, 80, 80, 30, 30, 10, 10, 30, 30, 100, 100, 20, 20, 140, 140,
                    ],
                },
            ],
            chart: {
                fontFamily: "inherit",
                type: "line",
                height: 300,
                toolbar: { show: !1 },
            },
            legend: { show: !1 },
            dataLabels: { enabled: !1 },
            stroke: {
                curve: "smooth",
                show: !0,
                width: 2,
                colors: ["var(--bs-primary)"],
            },
            xaxis: {
                categories: [
                    "1W",
                    "",
                    "3W",
                    "",
                    "5W",
                    "6W",
                    "7W",
                    "8W",
                    "9W",
                    "",
                    "11W",
                    "",
                    "13W",
                    "",
                    "15W",
                ],
                axisBorder: { show: !1 },
                axisTicks: { show: !1 },
                tickAmount: 6,
                labels: {
                    rotate: 0,
                    rotateAlways: !0,
                    style: { fontSize: "10px", colors: "#adb0bb", fontWeight: "600" },
                },
            },
            yaxis: {
                show: false,
                tickAmount: 3,
            },
            tooltip: {
                theme: "dark",
            },
            colors: ["var(--bs-primary)"],
            grid: {
                borderColor: "var(--bs-primary-bg-subtle)",
                strokeDashArray: 4,
                yaxis: { show: false },
            },
            markers: {
                strokeColor: ["var(--bs-primary)"],
                strokeWidth: 3,
            },
        };
    
        var chart_area_spline = new ApexCharts(
            document.querySelector("#settlements"),
            settlements
        );
        chart_area_spline.render();
    
    }, [])
    
  return (
    <div className="card bg-primary-subtle">
    <div className="card-body">
      <div className="hstack align-items-center gap-3 mb-4">
        <span className="d-flex align-items-center justify-content-center round-48 bg-white rounded flex-shrink-0">
          <Icon icon="solar:box-linear" className="fs-7 text-primary"></Icon>
        </span>
        <div>
          <p className="mb-1 text-dark-light">Total settlements</p>
          <h4 className="mb-0 fw-bolder">$122,580</h4>
        </div>
      </div>
      <div style={{height: "278px;"}}>
        <div id="settlements"></div>
      </div>
      <div className="row mt-4 mb-2">
        <div className="col-md-6 text-center">
          <p className="mb-1 text-dark-light lh-lg">Total balance</p>
          <h4 className="mb-0 text-nowrap">$122,580</h4>
        </div>
        <div className="col-md-6 text-center mt-3 mt-md-0">
          <p className="mb-1 text-dark-light lh-lg">Withdrawals</p>
          <h4 className="mb-0">$31,640</h4>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TotalSettlements