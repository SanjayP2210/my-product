import welcomeBG from "../assets/images/backgrounds/welcome-bg.png";
import dashPrd1 from "../assets/images/products/dash-prd-1.jpg";
import dashPrd2 from "../assets/images/products/dash-prd-2.jpg";
import dashPrd3 from "../assets/images/products/dash-prd-3.jpg";
import dashPrd4 from "../assets/images/products/dash-prd-4.jpg";
import { Icon } from "@iconify/react";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5">
          {/* <!-- -------------------------------------------- -->
              <!-- Welcome Card -->
              <!-- -------------------------------------------- --> */}
          <div className="card text-bg-primary">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-7">
                  <div className="d-flex flex-column h-100">
                    <div className="hstack gap-3">
                      <span className="d-flex align-items-center justify-content-center round-48 bg-white rounded flex-shrink-0">
                        <Icon
                          icon={"solar:course-up-outline"}
                          className={"fs-7 text-muted"}
                        ></Icon>
                      </span>
                      <h5 className="text-white fs-6 mb-0">
                        Welcome Back
                        <br />
                        David
                      </h5>
                    </div>
                    <div className="mt-4 mt-sm-auto">
                      <div className="row">
                        <div className="col-6">
                          <span className="opacity-75">Budget</span>
                          <h4 className="mb-0 text-white mt-1 text-nowrap fs-13 fw-bolder">
                            $98,450
                          </h4>
                        </div>
                        <div
                          className="col-6 border-start border-light"
                          // style={{"--bs-border-opacity: .15"}}
                        >
                          <span className="opacity-75">Expense</span>
                          <h4 className="mb-0 text-white mt-1 text-nowrap fs-13 fw-bolder">
                            $2,440
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-5 text-center text-md-end">
                  <img
                    src={welcomeBG}
                    alt="welcome"
                    className="img-fluid mb-n7 mt-2"
                    width="180"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {/* <!-- -------------------------------------------- -->
                <!-- Customers -->
                <!-- -------------------------------------------- --> */}
            <div className="col-md-6">
              <div className="card bg-secondary-subtle overflow-hidden shadow-none">
                <div className="card-body p-4">
                  <span className="text-dark-light">Customers</span>
                  <div className="hstack gap-6">
                    <h5 className="mb-0 fs-7">36,358</h5>
                    <span className="fs-11 text-dark-light fw-semibold">
                      -12%
                    </span>
                  </div>
                </div>
                <div id="customers"></div>
              </div>
            </div>
            {/* <!-- -------------------------------------------- -->
                <!-- Projects -->
                <!-- -------------------------------------------- --> */}
            <div className="col-md-6">
              <div className="card bg-danger-subtle overflow-hidden shadow-none">
                <div className="card-body p-4">
                  <span className="text-dark-light">Projects</span>
                  <div className="hstack gap-6 mb-4">
                    <h5 className="mb-0 fs-7">78,298</h5>
                    <span className="fs-11 text-dark-light fw-semibold">
                      +31.8%
                    </span>
                  </div>
                  <div className="mx-n1">
                    <div id="projects"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          {/* <!-- -------------------------------------------- -->
              <!-- Revenue Forecast --> */}
          {/* <!-- -------------------------------------------- --> */}
          <div className="card">
            <div className="card-body pb-4">
              <div className="d-md-flex align-items-center justify-content-between mb-4">
                <div className="hstack align-items-center gap-3">
                  <span className="d-flex align-items-center justify-content-center round-48 bg-primary-subtle rounded flex-shrink-0">
                    <Icon
                      icon="solar:layers-linear"
                      className="fs-7 text-primary"
                    ></Icon>
                  </span>
                  <div>
                    <h5 className="card-title">Revenue Forecast</h5>
                    <p className="card-subtitle mb-0">Overview of Profit</p>
                  </div>
                </div>

                <div className="hstack gap-9 mt-4 mt-md-0">
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-block flex-shrink-0 round-8 bg-primary rounded-circle"></span>
                    <span className="text-nowrap text-muted">2024</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-block flex-shrink-0 round-8 bg-danger rounded-circle"></span>
                    <span className="text-nowrap text-muted">2023</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-block flex-shrink-0 round-8 bg-secondary rounded-circle"></span>
                    <span className="text-nowrap text-muted">2022</span>
                  </div>
                </div>
              </div>
              <div style={{ height: "295px" }} className="me-n7">
                <div id="revenue-forecast"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          {/* <!-- -------------------------------------------- -->
              <!-- Your Performance -->
              <!-- -------------------------------------------- --> */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Your Performance</h5>
              <p className="card-subtitle mb-0 lh-base">
                Last check on 25 february
              </p>

              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="vstack gap-9 mt-2">
                    <div className="hstack align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded bg-primary-subtle flex-shrink-0">
                        <Icon
                          icon="solar:shop-2-linear"
                          className="fs-7 text-primary"
                        ></Icon>
                      </div>
                      <div>
                        <h6 className="mb-0 text-nowrap">64 new orders</h6>
                        <span>Processing</span>
                      </div>
                    </div>
                    <div className="hstack align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded bg-danger-subtle">
                        <Icon
                          icon="solar:filters-outline"
                          className="fs-7 text-danger"
                        ></Icon>
                      </div>
                      <div>
                        <h6 className="mb-0">4 orders</h6>
                        <span>On hold</span>
                      </div>
                    </div>
                    <div className="hstack align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded bg-secondary-subtle">
                        <Icon
                          icon="solar:pills-3-linear"
                          className="fs-7 text-secondary"
                        ></Icon>
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
                      Learn insigs how to manage all aspects of your startup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="row">
            <div className="col-md-6">
              {/* <!-- -------------------------------------------- -->
                  <!-- Customers -->
                  <!-- -------------------------------------------- --> */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 className="card-title fw-semibold">Customers</h5>
                      <p className="card-subtitle mb-0">Last 7 days</p>
                    </div>
                    <span className="fs-11 text-success fw-semibold lh-lg">
                      +26.5%
                    </span>
                  </div>
                  <div className="py-4 my-1">
                    <div id="customers-area"></div>
                  </div>
                  <div className="d-flex flex-column align-items-center gap-2 w-100 mt-3">
                    <div className="d-flex align-items-center gap-2 w-100">
                      <span className="d-block flex-shrink-0 round-8 bg-primary rounded-circle"></span>
                      <h6 className="fs-3 fw-normal text-muted mb-0">
                        April 07 - April 14
                      </h6>
                      <h6 className="fs-3 fw-normal mb-0 ms-auto text-muted">
                        6,380
                      </h6>
                    </div>
                    <div className="d-flex align-items-center gap-2 w-100">
                      <span className="d-block flex-shrink-0 round-8 bg-light rounded-circle"></span>
                      <h6 className="fs-3 fw-normal text-muted mb-0">
                        Last Week
                      </h6>
                      <h6 className="fs-3 fw-normal mb-0 ms-auto text-muted">
                        4,298
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              {/* <!-- -------------------------------------------- -->
                  <!-- Sales Overview -->
                  <!-- -------------------------------------------- --> */}
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
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {/* <!-- -------------------------------------------- -->
              <!-- Revenue by Product -->
              <!-- -------------------------------------------- --> */}
          <div className="card mb-lg-0">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 mb-9 justify-content-between align-items-center">
                <h5 className="card-title fw-semibold mb-0">
                  Revenue by Product
                </h5>
                <select className="form-select w-auto fw-semibold">
                  <option value="1">Sep 2024</option>
                  <option value="2">Oct 2024</option>
                  <option value="3">Nov 2024</option>
                </select>
              </div>

              <div className="table-responsive">
                <ul
                  className="nav nav-tabs theme-tab gap-3 flex-nowrap"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-toggle="tab"
                      href="#app"
                      role="tab"
                    >
                      <div className="hstack gap-2">
                        <Icon
                          icon="solar:widget-linear"
                          className="fs-4"
                        ></Icon>
                        <span>App</span>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#mobile"
                      role="tab"
                    >
                      <div className="hstack gap-2">
                        <Icon
                          icon="solar:smartphone-line-duotone"
                          className="fs-4"
                        ></Icon>
                        <span>Mobile</span>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#saas"
                      role="tab"
                    >
                      <div className="hstack gap-2">
                        <Icon
                          icon="solar:calculator-linear"
                          className="fs-4"
                        ></Icon>
                        <span>SaaS</span>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#other"
                      role="tab"
                    >
                      <div className="hstack gap-2">
                        <Icon
                          icon="solar:folder-open-outline"
                          className="fs-4"
                        ></Icon>
                        <span>Others</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content mb-n3">
                <div className="tab-pane active" id="app" role="tabpanel">
                  <div className="table-responsive" data-simplebar>
                    <table className="table text-nowrap align-middle table-custom mb-0 last-items-borderless">
                      <thead>
                        <tr>
                          <th scope="col" className="fw-normal ps-0">
                            Assigned
                          </th>
                          <th scope="col" className="fw-normal">
                            Progress
                          </th>
                          <th scope="col" className="fw-normal">
                            Priority
                          </th>
                          <th scope="col" className="fw-normal">
                            Budget
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd1}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Minecraf App</h6>
                                <span>Jason Roy</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              Low
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd2}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Web App Project</h6>
                                <span>Mathew Flintoff</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Medium
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd3}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Modernize Dashboard</h6>
                                <span>Anil Kumar</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              Very High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd4}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Dashboard Co</h6>
                                <span>George Cruize</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane" id="mobile" role="tabpanel">
                  <div className="table-responsive" data-simplebar>
                    <table className="table text-nowrap align-middle table-custom mb-0 last-items-borderless">
                      <thead>
                        <tr>
                          <th scope="col" className="fw-normal ps-0">
                            Assigned
                          </th>
                          <th scope="col" className="fw-normal">
                            Progress
                          </th>
                          <th scope="col" className="fw-normal">
                            Priority
                          </th>
                          <th scope="col" className="fw-normal">
                            Budget
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd2}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Web App Project</h6>
                                <span>Mathew Flintoff</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Medium
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd3}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Modernize Dashboard</h6>
                                <span>Anil Kumar</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              Very High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd1}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Minecraf App</h6>
                                <span>Jason Roy</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              Low
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd4}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Dashboard Co</h6>
                                <span>George Cruize</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane" id="saas" role="tabpanel">
                  <div className="table-responsive" data-simplebar>
                    <table className="table text-nowrap align-middle table-custom mb-0 last-items-borderless">
                      <thead>
                        <tr>
                          <th scope="col" className="fw-normal ps-0">
                            Assigned
                          </th>
                          <th scope="col" className="fw-normal">
                            Progress
                          </th>
                          <th scope="col" className="fw-normal">
                            Priority
                          </th>
                          <th scope="col" className="fw-normal">
                            Budget
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd2}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Web App Project</h6>
                                <span>Mathew Flintoff</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Medium
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd1}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Minecraf App</h6>
                                <span>Jason Roy</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              Low
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>

                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd3}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Modernize Dashboard</h6>
                                <span>Anil Kumar</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              Very High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd4}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Dashboard Co</h6>
                                <span>George Cruize</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tab-pane" id="other" role="tabpanel">
                  <div className="table-responsive" data-simplebar>
                    <table className="table text-nowrap align-middle table-custom mb-0 last-items-borderless">
                      <thead>
                        <tr>
                          <th scope="col" className="fw-normal ps-0">
                            Assigned
                          </th>
                          <th scope="col" className="fw-normal">
                            Progress
                          </th>
                          <th scope="col" className="fw-normal">
                            Priority
                          </th>
                          <th scope="col" className="fw-normal">
                            Budget
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd1}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Minecraf App</h6>
                                <span>Jason Roy</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              Low
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd3}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Modernize Dashboard</h6>
                                <span>Anil Kumar</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              Very High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd2}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Web App Project</h6>
                                <span>Mathew Flintoff</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Medium
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>

                        <tr>
                          <td className="ps-0">
                            <div className="d-flex align-items-center gap-6">
                              <img
                                src={dashPrd4}
                                alt="prd1"
                                width="48"
                                className="rounded"
                              />
                              <div>
                                <h6 className="mb-0">Dashboard Co</h6>
                                <span>George Cruize</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>73.2%</span>
                          </td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              High
                            </span>
                          </td>
                          <td>
                            <span className="text-dark-light">$3.5k</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          {/* <!-- -------------------------------------------- -->
              <!-- Total settlements -->
              <!-- -------------------------------------------- --> */}
          <div className="card bg-primary-subtle mb-0">
            <div className="card-body">
              <div className="hstack align-items-center gap-3 mb-4">
                <span className="d-flex align-items-center justify-content-center round-48 bg-white rounded flex-shrink-0">
                  <Icon
                    icon="solar:box-linear"
                    className="fs-7 text-primary"
                  ></Icon>
                </span>
                <div>
                  <p className="mb-1 text-dark-light">Total settlements</p>
                  <h4 className="mb-0 fw-bolder">$122,580</h4>
                </div>
              </div>
              <div style={{ height: "278px" }}>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
