import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'

const CustomerChart = () => {
    useEffect(() => {
        var chart_users = {
            series: [
                {
                    name: "April 07 ",
                    data: [0, 20, 15, 19, 14, 25, 30],
                },
                {
                    name: "Last Week",
                    data: [0, 8, 19, 13, 26, 16, 25],
                },
            ],
            chart: {
                fontFamily: "inherit",
                height: 100,
                type: "line",
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true,
                },
            },
            colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
            grid: {
                show: false,
            },
            stroke: {
                curve: "smooth",
                colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
                width: 2,
            },
            markers: {
                colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
                strokeColors: "transparent",
            },
            tooltip: {
                theme: "dark",
                x: {
                    show: false,
                },
                followCursor: true,
            },
        };
        var chart_line_basic = new ApexCharts(
            document.querySelector("#customers-area"),
            chart_users
        );
        chart_line_basic.render();
    }, [])
    
  return (
    <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <h5 className="card-title fw-semibold">Customers</h5>
          <p className="card-subtitle mb-0">Last 7 days</p>
        </div>
        <span className="fs-11 text-success fw-semibold lh-lg">+26.5%</span>
      </div>
      <div className="py-4 my-1">
        <div id="customers-area"></div>
      </div>
      <div className="d-flex flex-column align-items-center gap-2 w-100 mt-3">
        <div className="d-flex align-items-center gap-2 w-100">
          <span className="d-block flex-shrink-0 round-8 bg-primary rounded-circle"></span>
          <h6 className="fs-3 fw-normal text-muted mb-0">April 07 - April 14</h6>
          <h6 className="fs-3 fw-normal mb-0 ms-auto text-muted">6,380</h6>
        </div>
        <div className="d-flex align-items-center gap-2 w-100">
          <span className="d-block flex-shrink-0 round-8 bg-light rounded-circle"></span>
          <h6 className="fs-3 fw-normal text-muted mb-0">Last Week</h6>
          <h6 className="fs-3 fw-normal mb-0 ms-auto text-muted">4,298</h6>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CustomerChart