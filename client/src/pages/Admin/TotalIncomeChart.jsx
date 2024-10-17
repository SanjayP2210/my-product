import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { Icon } from "@iconify/react";

const TotalIncomeChart = () => {
    useEffect(() => {
        var customers = {
            chart: {
              id: "sparkline3",
              type: "line",
              fontFamily: "inherit",
              foreColor: "#adb0bb",
              height: 60,
              sparkline: {
                enabled: true,
              },
              group: "sparklines",
            },
            series: [
              {
                name: "Income",
                color: "var(--bs-danger)",
                data: [0,400],
              },
            ],
            stroke: {
              curve: "smooth",
              width: 2,
            },
            markers: {
              size: 0,
            },
            tooltip: {
              theme: "dark",
              fixed: {
                enabled: true,
                position: "right",
              },
              x: {
                show: false,
              },
            },
          };
          new ApexCharts(document.querySelector("#total-income"), customers).render();
      return () => {
      }
    }, [])
    
  return (
    <div className="col-md-6 col-lg-12">
    <div className="card">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-6 mb-4">
          <span className="round-48 d-flex align-items-center justify-content-center rounded bg-danger-subtle">
            <Icon icon="solar:box-linear" className="fs-7 text-danger"></Icon>
          </span>
          <h6 className="mb-0 fs-4 fw-medium">Total Income</h6>
        </div>
        <div className="row">
          <div className="col-6">
            <h4 className="fs-7">$680</h4>
            <span className="fs-11 text-success fw-semibold">+18%</span>
          </div>
          <div className="col-6">
            <div id="total-income"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TotalIncomeChart