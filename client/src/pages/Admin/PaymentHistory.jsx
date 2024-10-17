import React, { useEffect, useState } from "react";
import apiService, { apiRequest } from "../../service/apiService";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const [PaymentHistory, setPaymentHistory] = useState([]);
  const getAllPayments = async () => {
    try {
      const response = await apiService.getRequest("payment/get-all-payments");
      if (response.statusCode === 200) {
        setPaymentHistory(response.charges);
      } else {
        toast.error("error while getting payment history");
      }
    } catch (error) {
      toast.error("error while getting payment history", error);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, []);

  return (
    <div>
      {" "}
      <div className="table-responsive border rounded scroll-bar">
        <table
          style={{ width: "100%" }}
          className="table align-middle mb-0 sortable-table"
        >
          <thead>
            <tr>
              <th>
                <b>Payment Id</b>
              </th>

              <th style={{ width: "20%" }}>
                <b>Status</b>
              </th>
              <th style={{ width: "15%" }}>
                <b>Items Qty</b>
              </th>
              <th style={{ width: "10%" }}>
                <b>Price</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {orderList?.length > 0 ? (
          orderList?.map((order, index) => {
            return (
              <>
                <tr key={index}>
                  <td>
                    <h6 className="mb-0">{order?._id}</h6>
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
                  {isAdmin  &&
                  <td>
                    <a
                      className="fs-6"
                      href="javascript:void(0)"
                      onClick={() => {
                        navigate(`/order-detail/${order._id}`);
                      }}
                    >
                      <i className="ti ti-info-circle-filled"></i>
                    </a>
                    <a
                      className="fs-6"
                      href="javascript:void(0)"
                      style={{ marginLeft: "20px" }}
                      onClick={() => {
                        navigate(`/edit-order/${order._id}`);
                      }}
                    >
                      <i className="ti ti-edit"></i>
                    </a>
                    <a
                      className="fs-6"
                      href="javascript:void(0)"
                      style={{ marginLeft: "20px" }}
                      onClick={() => {
                        removeOrder(order?._id);
                      }}
                    >
                      <i className="ti ti-trash"></i>
                    </a>
                  </td>
                  }
                </tr>
              </>
            );
          })
        ) : ( */}
            <tr>
              <td colSpan="6" className="text-center">
                No orders found.
              </td>
            </tr>
            {/* )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
