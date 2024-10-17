import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { Icon } from "@iconify/react";

const YourPerformance = () => {
    useEffect(() => {
        var options = {
            series: [20, 20, 20, 20, 20],
            labels: ["245", "45", "14", "78", "95"],
            chart: {
                height: 205,
                fontFamily: "inherit",
                type: "donut",
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 90,
                    offsetY: 10,
                    donut: {
                        size: "90%",
                    },
                },
            },
            grid: {
                padding: {
                    bottom: -80,
                },
            },
            legend: {
                show: false,
            },
            dataLabels: {
                enabled: false,
                name: {
                    show: false,
                },
            },
            stroke: {
                width: 2,
                colors: "var(--bs-card-bg)",
            },
            tooltip: {
                fillSeriesColor: false,
            },
            colors: [
                "var(--bs-danger)",
                "var(--bs-warning)",
                "var(--bs-warning-bg-subtle)",
                "var(--bs-secondary-bg-subtle)",
                "var(--bs-secondary)",
            ],
            responsive: [{
                breakpoint: 1400,
                options: {
                    chart: {
                        height: 170
                    },
                },
            }],
    
        };
    
        var chart = new ApexCharts(
            document.querySelector("#your-preformance"),
            options
        );
        chart.render();
        return () => {
          chart = null;
        }
    }, [])

  return (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Your Performance</h5>
                  <p className="card-subtitle mb-0 lh-base">Last check on 25 february</p>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="vstack gap-9 mt-2">
                        <div className="hstack align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center round-48 rounded bg-primary-subtle flex-shrink-0">
                            <Icon icon="solar:shop-2-linear" className="fs-7 text-primary"></Icon>
                          </div>
                          <div>
                            <h6 className="mb-0 text-nowrap">64 new orders</h6>
                            <span>Processing</span>
                          </div>

                        </div>
                        <div className="hstack align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center round-48 rounded bg-danger-subtle">
                            <Icon icon="solar:filters-outline" className="fs-7 text-danger"></Icon>
                          </div>
                          <div>
                            <h6 className="mb-0">4 orders</h6>
                            <span>On hold</span>
                          </div>

                        </div>
                        <div className="hstack align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center round-48 rounded bg-secondary-subtle">
                            <Icon icon="solar:pills-3-linear" className="fs-7 text-secondary"></Icon>
                          </div>
                          <div>
                            <h6 className="mb-0">12 orders</h6>
                            <span>Delivered</span>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center mt-sm-n7">
                        <div id="your-preformance"></div>
                        <h2 className="fs-8">275</h2>
                        <p className="mb-0">
                          Learn insigs how to manage all aspects of your
                          startup.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
  )
}

export default YourPerformance