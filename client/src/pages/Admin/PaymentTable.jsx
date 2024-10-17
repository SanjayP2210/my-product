import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, formatToINR } from "../../constants/utilities";

const PaymentTable = ({
  handleSort,
  getSortIcon,
  paymentList,
  formatedDate,
  setPage,
  page,
  setLimit,
  removePayment,
  totalPages,
  totalCount,
}) => {
  const {
    isAdmin,
  } = useSelector((state) => state.auth);
  const isUser = window.location.pathname.includes('my-payment');
  const navigate = useNavigate();
  return (
    <div className="table-responsive border rounded scroll-bar">
      <table
        style={{ width: "100%" }}
        className="table align-middle mb-0 sortable-table"
      >
        <thead>
          <tr>
            <th>
              <b>Payments Id </b>
            </th>

            <th style={{ width: "10%" }}>
              <b>Status </b>
            </th>
            <th style={{ width: "15%" }}>
              <b>Order Status </b>
            </th>
            <th style={{ width: "15%" }}>
              <b>Payment Type</b>
            </th>
            <th style={{ width: "10%" }}>
              <b>Price</b>
            </th>
            <th
              style={{ width: "10%" }}
            >
              <b>Paid At </b>
            </th>
            <th
              style={{ width: "10%" }}
            >
              <b>Refund At </b>
            </th>
          </tr>
        </thead>
        <tbody>
          {paymentList?.length > 0 ? (
            paymentList?.map((payment, index) => {
                const paymentStatus = payment?.paymentInfo?.status === 'succeeded' ? "Paid" :
                payment?.paymentInfo?.status === 'refunded' ? 
                "Refund" : 
                 "Not Paid"
              return (
                <>
                  <tr key={index}>
                    <td>
                        <h6 className="mb-0">{payment?.paymentInfo?.id}</h6>
                    </td>
                    <td>
                      <span
                        className={`badge fs-2 fw-semibold ${
                          payment?.paymentInfo?.status === 'succeeded'
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge fs-2 fw-semibold ${
                          payment?.orderStatus &&
                          payment?.orderStatus === "Delivered"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {payment?.orderStatus}
                      </span>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-3">
                        {payment?.paymentInfo?.typeOfPayment === 'cod' ? 'Cash On Delivery' : 'Online'}
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-3">
                        {formatToINR(payment?.totalPrice)}
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-3">
                        {paymentStatus === 'Not Paid' && payment?.paidAt ? '---' : formatDate(payment?.paidAt) }
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-3">
                        {paymentStatus === 'Refund'  && payment?.refundAt ? formatDate(payment?.refundAt) : '---'   }
                      </h6>
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No payments found.
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
          {`${page * 1} - ${paymentList?.length} of ${totalCount}`}</p>
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

export default PaymentTable;
