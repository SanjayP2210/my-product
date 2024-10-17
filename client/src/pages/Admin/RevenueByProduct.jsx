import React from 'react'
import { Icon } from "@iconify/react";

const RevenueByProduct = () => {
  return (
    <div className="card">
    <div className="card-body">
      <div className="d-flex flex-wrap gap-3 mb-9 justify-content-between align-items-center">
        <h5 className="card-title fw-semibold mb-0">Revenue by Product</h5>
        <select className="form-select w-auto fw-semibold">
          <option value="1">Sep 2024</option>
          <option value="2">Oct 2024</option>
          <option value="3">Nov 2024</option>
        </select>
      </div>

      <div className="table-responsive">
        <ul className="nav nav-tabs theme-tab gap-3 flex-nowrap" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#app" role="tab">
              <div className="hstack gap-2">
                <Icon icon="solar:widget-linear" className="fs-4"></Icon>
                <span>App</span>
              </div>

            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#mobile" role="tab">
              <div className="hstack gap-2">
                <Icon icon="solar:smartphone-line-duotone" className="fs-4"></Icon>
                <span>Mobile</span>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#saas" role="tab">
              <div className="hstack gap-2">
                <Icon icon="solar:calculator-linear" className="fs-4"></Icon>
                <span>SaaS</span>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#other" role="tab">
              <div className="hstack gap-2">
                <Icon icon="solar:folder-open-outline" className="fs-4"></Icon>
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
                  <th scope="col" className="fw-normal ps-0">Assigned
                  </th>
                  <th scope="col" className="fw-normal">Progress</th>
                  <th scope="col" className="fw-normal">Priority</th>
                  <th scope="col" className="fw-normal">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-1.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-success-subtle text-success">Low</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-2.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-warning-subtle text-warning">Medium</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-3.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-secondary-subtle text-secondary">Very
                      High</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-4.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-danger-subtle text-danger">High</span>
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
                  <th scope="col" className="fw-normal ps-0">Assigned
                  </th>
                  <th scope="col" className="fw-normal">Progress</th>
                  <th scope="col" className="fw-normal">Priority</th>
                  <th scope="col" className="fw-normal">Budget</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-2.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-warning-subtle text-warning">Medium</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-3.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-secondary-subtle text-secondary">Very
                      High</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-1.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-success-subtle text-success">Low</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-4.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-danger-subtle text-danger">High</span>
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
                  <th scope="col" className="fw-normal ps-0">Assigned
                  </th>
                  <th scope="col" className="fw-normal">Progress</th>
                  <th scope="col" className="fw-normal">Priority</th>
                  <th scope="col" className="fw-normal">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-2.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-warning-subtle text-warning">Medium</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-1.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-success-subtle text-success">Low</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>

                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-3.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-secondary-subtle text-secondary">Very
                      High</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-4.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-danger-subtle text-danger">High</span>
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
                  <th scope="col" className="fw-normal ps-0">Assigned
                  </th>
                  <th scope="col" className="fw-normal">Progress</th>
                  <th scope="col" className="fw-normal">Priority</th>
                  <th scope="col" className="fw-normal">Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-1.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-success-subtle text-success">Low</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-3.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-secondary-subtle text-secondary">Very
                      High</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>
                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-2.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-warning-subtle text-warning">Medium</span>
                  </td>
                  <td>
                    <span className="text-dark-light">$3.5k</span>
                  </td>
                </tr>

                <tr>
                  <td className="ps-0">
                    <div className="d-flex align-items-center gap-6">
                      <img src="../assets/images/products/dash-prd-4.jpg" alt="prd1" width="48" className="rounded" />
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
                    <span className="badge bg-danger-subtle text-danger">High</span>
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
  )
}

export default RevenueByProduct