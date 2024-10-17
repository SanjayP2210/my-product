import React from "react";
import { NavLink } from "react-router-dom";

const BreadCrumb = ({ title, ref }) => {
  return (
    <div className="card card-body py-3">
      <div className="row align-items-center">
        <div className="col-12" ref={ref}>
          <div className="d-sm-flex align-items-center justify-space-between">
            <h4 className="mb-4 mb-sm-0 card-title">{title}</h4>
            <nav aria-label="breadcrumb" className="ms-auto">
              <ol className="breadcrumb">
                <li className="breadcrumb-item d-flex align-items-center">
                  <NavLink
                    className="text-muted text-decoration-none d-flex"
                    to={"/"}
                  >
                    <i className="ti ti-home-2 fs-6"></i>
                  </NavLink>
                </li>
                <li className="breadcrumb-item" aria-current="page">
                  <span className="badge fw-medium fs-2 bg-primary-subtle text-primary">
                    {title}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
