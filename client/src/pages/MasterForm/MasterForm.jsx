import React, { useState, useEffect } from "react";
import axios from "axios";
import apiService, { apiRequest } from "../../service/apiService";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import './index.css'
const MasterForm = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editing, setEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [currentTab, setCurrentTab] = useState("all");
  const { componentName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const commonClass =
    "nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3 me-0 me-md-2";
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequest(`${componentName}/master`);
      if (response) {
        const filteredStatus = response?.[componentName];
        console.log("filteredStatus", filteredStatus);
        setItems(filteredStatus);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (componentName) {
      fetchItems();
    }
  }, [componentName]);

  const resetForm = () => {
    setEditing(false);
    setCurrentItemId(null);
    setIsLoading(false);
    setName("");
    setIsActive(true);
    fetchItems();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formObject = {
        name,
        isActive,
      };
      setIsLoading(true);
      let response = editing
        ? await apiService.patchRequest(
            `${componentName}/${currentItemId}`,
            formObject
          )
        : await apiService.postRequest(componentName, formObject);
      if (response) {
        resetForm();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setIsActive(item.isActive);
    setEditing(true);
    setCurrentItemId(item._id);
  };

  const handleDeactive = async (id, item) => {
    try {
      setIsLoading(true);
      const response = await apiService.patchRequest(`${componentName}/${id}`, {
        isActive: !item?.isActive,
      });
      if (response) {
        resetForm();
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const filterItem = () => {
    const filterItems = items?.filter((item) => {
      return currentTab === "all"
        ? item
        : currentTab === "active"
        ? item?.isActive
        : !item?.isActive;
    });

    if (filterItems?.length > 0) {
      return filterItems.map((item, index) => {
        return (
          <tr key={item?._id}>
            <td style={{ color: "black" }}>
              <p
                style={{
                  textDecoration: !item?.isActive ? "line-through" : "none",
                }}
              >
                {item?.name}
              </p>
            </td>
            <td style={{ width: "0" }}>
              {item?.isActive && (
                <a
                  className="fs-6 text-muted"
                  href="javascript:void(0)"
                  onClick={() => {
                    handleEdit(item);
                  }}
                >
                  <i
                    style={{ color: "var(--bs-primary)" }}
                    className="ti ti-edit"
                  ></i>
                </a>
              )}
              <a
                className="fs-6 text-muted"
                href="javascript:void(0)"
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  handleDeactive(item?._id, item);
                }}
              >
                {item?.isActive ? (
                  <i style={{ color: "red" }} className="ti ti-x"></i>
                ) : (
                  <i style={{ color: "green" }} className="ti ti-check"></i>
                )}
              </a>
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan="2" style={{ textAlign: "center", color: "black" }}>
            <p>
              <b>No Data Found</b>
            </p>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <div className="row common-form">
        <div className="center-item">
          <div className="mt-5">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="form-control"
                      required
                    />

                    <button className="btn btn-primary" type="submit">
                      {editing
                        ? `Update ${componentName}`
                        : `Add New ${componentName}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <ul className="nav nav-pills p-3 mb-3 rounded align-items-center card flex-row d-flex justify-content-center">
                  <li
                    className="nav-item"
                    onClick={(e) => {
                      setCurrentTab("all");
                    }}
                  >
                    <button
                      style={{ fontSize: "15px" }}
                      className={`btn btn-primary ${commonClass} ${
                        currentTab === "all" ? "active" : ""
                      }`}
                      id="all-tab"
                    >
                      <i className="ti ti-list fill-white"></i>
                      <span className="d-none d-md-block fw-medium">
                        All {componentName}
                      </span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    onClick={(e) => {
                      setCurrentTab("active");
                    }}
                  >
                    <button
                      style={{ fontSize: "15px" }}
                      className={`btn btn-primary ${commonClass} ${
                        currentTab === "active" ? "active" : ""
                      }`}
                      id="active-tab"
                    >
                      <i className="ti ti-check fill-white"></i>
                      <span className="d-none d-md-block fw-medium">
                        Active {componentName}
                      </span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    onClick={(e) => {
                      setCurrentTab("de-active");
                    }}
                  >
                    <button
                      style={{ fontSize: "15px" }}
                      className={`btn btn-primary ${commonClass} ${
                        currentTab === "de-active" ? "active" : ""
                      }`}
                      id="deactive-tab"
                    >
                      <i className="ti ti-x fill-white"></i>
                      <span className="d-none d-md-block fw-medium">
                        Deactive {componentName}
                      </span>
                    </button>
                  </li>
                </ul>

                <div className="table-responsive border rounded">
                  <table className="table align-middle text-nowrap mb-0">
                    <thead>
                      <tr>
                        <th
                          style={{ backgroundColor: "#635BFF", color: "white" }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            backgroundColor: "#635BFF",
                            color: "white",
                            width: "0",
                          }}
                          scope="col"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>{filterItem()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterForm;
