import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToINR } from "../../../constants/utilities";
import { useSelector } from "react-redux";

const OrderTable = ({
  handleSort,
  getSortIcon,
  orderList,
  formatedDate,
  setPage,
  page,
  setLimit,
  removeOrder,
  totalPages,
  totalCount,
}) => {
  const {
    isAdmin,
  } = useSelector((state) => state.auth);
  const isUser = window.location.pathname.includes('my-order');
  const navigate = useNavigate();
  return (
    <div className="table-responsive border rounded scroll-bar">
      <table
        style={{ width: "100%" }}
        className="table align-middle mb-0 sortable-table"
      >
        <thead>
          <tr>
            <th onClick={() => handleSort("_id")}>
              <b>Orders Id {getSortIcon("_id")}</b>
            </th>

            <th style={{ width: "20%" }} onClick={() => handleSort("orderStatus")}>
              <b>Status {getSortIcon("orderStatus")}</b>
            </th>
            <th style={{ width: "10%" }} onClick={() => handleSort("itemsQty")}>
              <b>Items Qty {getSortIcon("itemsQty")}</b>
            </th>
            <th
              style={{ width: "10%" }}
              onClick={() => handleSort("itemsPrice")}
            >
              <b>Price {getSortIcon("itemsPrice")}</b>
            </th>
            <th
              style={{ width: "20%" }}
              onClick={() => handleSort("createdAt")}
            >
              <b>Created Date {getSortIcon("createdAt")}</b>
            </th>
            {isAdmin  && !isUser &&
              <th scope="col" style={{ width: "10%" }}>
              <b>Actions</b>
            </th>}
          </tr>
        </thead>
        <tbody>
          {orderList?.length > 0 ? (
            orderList?.map((order, index) => {
              return (
                <>
                  <tr key={index}>
                    <td>
                    <Link
                        className="fs-6"
                        to={`/order-detail/${order._id}`}
                      >
                        <h6 className="mb-0">{order?._id}</h6>
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`badge fs-2 fw-semibold ${
                          order?.orderStatus &&
                          order?.orderStatus === "Delivered"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {order?.orderStatus}
                      </span>
                    </td>
                    <td>
                      <h6 className="mb-0">{order?.orderItems.length}</h6>
                    </td>{" "}
                    <td>
                      <h6 className="mb-0 fs-3">
                        {formatToINR(order?.totalPrice)}
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-3">
                        {formatDate(order?.createdAt)}
                      </h6>
                    </td>
                    {isAdmin && !isUser  &&
                    <td>
                      <Link
                        className="fs-6"
                        to={`/order-detail/${order._id}`}
                      >
                        <i className="ti ti-info-circle-filled"></i>
                      </Link>
                      <Link
                        className="fs-6"
                        style={{ marginLeft: "20px" }}
                        to={`/admin/edit-order/${order._id}`}
                      >
                        <i className="ti ti-edit"></i>
                      </Link>
                      <Link
                        className="fs-6"
                        style={{ marginLeft: "20px" }}
                        onClick={() => {
                          removeOrder(order?._id);
                        }}
                      >
                        <i className="ti ti-trash"></i>
                      </Link>
                    </td>
                    }
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex align-items-center justify-content-end py-1">
        <p className="mb-0 fs-2">Rows per page:</p>
        <select
          className="form-select w-auto ms-0 ms-sm-2 me-8 me-sm-4 py-1 pe-7 ps-2 border-0"
          aria-label="Default select example"
          onChange={(e) => {
            setPage(1);
            setLimit(e.target.value);
          }}
        >
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="25">25</option>
        </select>
        <p className="mb-0 fs-2">
          {`${page * 1} - ${orderList?.length} of ${totalCount}`}</p>
        <nav aria-label="...">
          <ul className="pagination justify-content-center mb-0 ms-8 ms-sm-9">
            <li className="page-item p-1">
              <a
                className="page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
                href="javascript:void(0)"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <i className="ti ti-chevron-left"></i>
              </a>
            </li>
            <li className="page-item p-1">
              <a
                className="page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
                href="javascript:void(0)"
                onClick={() =>
                  setPage((prev) => {
                    return Math.min(prev + 1, totalPages);
                  })
                }
                disabled={page === totalPages}
              >
                <i className="ti ti-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default OrderTable;
