import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'

const AnnualProfitChart = () => {
    useEffect(() => {
        var options = {
            chart: {
                id: "annual-profit",
                type: "area",
                height: 80,
                sparkline: {
                    enabled: true,
                },
                group: "sparklines",
                fontFamily: "inherit",
                foreColor: "#adb0bb",
            },
            series: [
                {
                    name: "Users",
                    color: "var(--bs-primary)",
                    data: [25, 66, 20, 40, 12, 58, 20],
                },
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            fill: {
                type: "gradient",
                color: "var(--bs-primary)",
    
                gradient: {
                    shadeIntensity: 0,
                    inverseColors: false,
                    opacityFrom: 0.1,
                    opacityTo: 0.1,
                    stops: [100],
                },
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
        new ApexCharts(document.querySelector("#annual-profit"), options).render();
    }, [])
    
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Annual Profit</h5>
        <div className="bg-primary bg-opacity-10 rounded-1 overflow-hidden mb-4">
          <div className="p-4 mb-9">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-dark-light">Conversion Rate</span>
              <h3 className="mb-0">18.4%</h3>
            </div>
          </div>
          <div id="annual-profit"></div>
        </div>
        <div className="d-flex align-items-center justify-content-between pb-6 border-bottom">
          <div>
            <span className="text-muted fw-medium">Added to Cart</span>
            <span className="fs-11 fw-medium d-block mt-1">5 clicks</span>
          </div>
          <div className="text-end">
            <h6 className="fw-bolder mb-1 lh-base">$21,120.70</h6>
            <span className="fs-11 fw-medium text-success">+13.2%</span>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between py-6 border-bottom">
          <div>
            <span className="text-muted fw-medium">Reached to Checkout</span>
            <span className="fs-11 fw-medium d-block mt-1">12 clicks</span>
          </div>
          <div className="text-end">
            <h6 className="fw-bolder mb-1 lh-base">$16,100.00</h6>
            <span className="fs-11 fw-medium text-danger">-7.4%</span>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between pt-6">
          <div>
            <span className="text-muted fw-medium">Added to Cart</span>
            <span className="fs-11 fw-medium d-block mt-1">24 views</span>
          </div>
          <div className="text-end">
            <h6 className="fw-bolder mb-1 lh-base">$6,400.50</h6>
            <span className="fs-11 fw-medium text-success">+9.3%</span>
          </div>
        </div>
      </div>
  </div>
  )
}

export default AnnualProfitChart