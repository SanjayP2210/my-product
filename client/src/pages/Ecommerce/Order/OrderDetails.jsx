import React, { Fragment, useEffect, useState } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getSingleOrder,
  resetOrderState,
  updateOrder,
} from "../../../reducers/orderReducer";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Loader from "../../../components/Loader/Loader";
import { formatDate, formatToINR } from "../../../constants/utilities";
import Select2 from "../../../components/Select2/Select2";
import { toast } from "react-toastify";
import UpdateProcessDropDown from "./UpdateProcessDropDown";

const OrderDetails = () => {
  const { orderDetail, isLoading, isOrderUpdated } = useSelector(
    (state) => state.order
  );
  const order = orderDetail;
  const isEditFlow =
    window?.location?.pathname?.includes("edit-order") &&
    !["Cancelled", "Delivered"].includes(order?.orderStatus);
  const dispatch = useDispatch();
  const { orderId } = useParams();
  console.log("orderId", orderId);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  useEffect(() => {
    dispatch(getSingleOrder(orderId));
  }, [orderId]);

  useEffect(() => {
    if (isOrderUpdated && isEditFlow) {
      toast.success("Order Updated Successfully");
      dispatch(resetOrderState());
      dispatch(getSingleOrder(orderId));
      setStatus("");
      setPaymentStatus("");
    }
  }, [isOrderUpdated, isEditFlow, orderId]);

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    let formObj = {
      status: status?.value,
      orderId,
    };
    if (paymentStatus.value === "succeeded") {
      formObj.status = "Shipped";
      formObj.payment_status = "succeeded";
    }
    if (status.value === "Cancelled") {
      formObj.payment_status = "refuned";
    }
    dispatch(updateOrder(formObj));
  };

  const getUpdatePaymentElement = () => {
    // if (["Cancelled", "Delivered", "Processing"].includes(order?.orderStatus)) {
    //   return <></>;
    // }
    let optionList = [
      {
        label: "Paid",
        value: "succeeded",
      },
      {
        label: "Refund",
        value: "refunded",
      },
    ];

    optionList = optionList.filter(
      (options) => options.value !== order?.paymentInfo?.status
    );
    return (
      <>
        <UpdateProcessDropDown
          titleValue={"Process Payment"}
          optionList={optionList}
          value={paymentStatus}
          setValue={setPaymentStatus}
          disabled={order?.orderStatus === "Processing"}
        />
        <br />
      </>
    );
  };

  const getUpdateProcessElement = () => {
    let titleValue = "Process Order";
    let optionList = [];
    // if (["Cancelled", "Delivered"].includes(order?.orderStatus)) {
    //   return <></>;
    // } else if (
    //   order?.orderStatus === "Shipped" &&
    //   order?.paymentInfo?.status === "succeeded"
    // ) {
      optionList = [
        {
          label: "Delivered",
          value: "Delivered",
        },
        {
          label: "Cancelled",
          value: "Cancelled",
        },
      ];
    // } else if (order?.orderStatus === "Processing") {
    //   optionList = [
    //     {
    //       label: "Shipped",
    //       value: "Shipped",
    //     },
    //   ];
    // }
    return (
      <UpdateProcessDropDown
        titleValue={titleValue}
        optionList={optionList}
        value={status}
        setValue={setStatus}
      />
    );
  };

  const OrderInfoSection = (order) =>{
    return <>
     <h5>Order Info</h5>
                        <div className="orderDetailsContainerBox">
                          <div>
                            <p>
                              <strong>
                                Order Status:
                                <span
                                  className={`badge fs-2 fw-semibold ${
                                    order?.orderStatus === "Delivered"
                                      ? "text-bg-success"
                                      : "text-bg-danger"
                                  }`}
                                  style={{ marginLeft: "20px" }}
                                >
                                  {order?.orderStatus}
                                </span>
                              </strong>
                            </p>
                          </div>
                          {order?.shippedAt && (
                            <div>
                              <p>
                                <strong>Shipped Date:</strong>{" "}
                              </p>
                               <p> &nbsp;&nbsp;{formatDate(order?.shippedAt)}</p>
                            </div>
                          )}
                          {order?.deliveredAt && (
                            <div>
                              <p>
                                <strong>Delivered Date:</strong>{" "}
                              </p>
                               <p>&nbsp;&nbsp;{formatDate(order?.deliveredAt)}</p>
                            </div>
                          )}
                        </div>
    </>
  }

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Order Detail"} />
        <div className="shop-detail">
          <div className="card">
            <div className="card-body p-4">
              <div className="orderDetailsContainer">
                <h3>Order ID: {order?._id}</h3>
                <div className="row">
                  <div className={"col-md-4"}>
                    <div className="card shadow-none border">
                      <div className="card-body p-4 address-card">
                        <h5>Shipping Info</h5>
                        <div className="orderDetailsContainerBox">
                          <div>
                            <p>
                              <strong>Name:</strong>
                            </p>
                            <span>{order?.user && order?.user.name}</span>
                          </div>
                          <div>
                            <p>
                              <strong>Phone:</strong>
                            </p>
                            <span>{order?.shippingInfo?.mobileNumber}</span>
                          </div>
                          <div>
                            <p>
                              <strong> Address:</strong>
                            </p>
                            <span
                              style={{ maxWidth: "200px", minWidth: "100px" }}
                            >
                              {order?.shippingInfo &&
                                [
                                  order?.shippingInfo?.street,
                                  order?.shippingInfo?.city,
                                  order?.shippingInfo?.state,
                                  order?.shippingInfo?.country,
                                  order?.shippingInfo?.zipCode,
                                ]?.join()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"col-md-4"}>
                    <div className="card shadow-none border">
                      <div className="card-body p-4 address-card">
                        <h5>Payment Info</h5>
                        <div className="orderDetailsContainerBox">
                          <div>
                            <p>
                              <strong>
                                Status:
                                <span
                                  className={`badge fs-2 fw-semibold ${
                                    order?.paymentInfo?.status === "succeeded"
                                      ? "text-bg-success"
                                      : "text-bg-danger"
                                  }`}
                                  style={{ marginLeft: "20px" }}
                                >
                                  {order?.paymentInfo?.status === "succeeded"
                                    ? "PAID"
                                    : order?.paymentInfo?.status === "refunded"
                                    ? "Refund"
                                    : "NOT PAID"}
                                </span>
                              </strong>
                            </p>
                          </div>
                          {order?.paymentInfo?.status === "succeeded" && (
                            <div>
                              <p>
                                <strong>Payment Date:</strong>
                                {"  "}
                              </p>
                                <p> &nbsp;&nbsp;{formatDate(order?.paidAt)}</p>
                            </div>
                          )}
                          <div>
                            <p>
                              <strong>Payment Method :</strong>
                            </p>
                             <p>&nbsp;&nbsp; {order?.paymentInfo?.typeOfPayment === "stripe"
                                ? "Online"
                                : "Cash On Delivery"}</p>
                          </div>
                          <div>
                            <p>
                              <strong>
                                Amount:
                                <span
                                  className={`badge fs-2 fw-semibold text-bg-dark`}
                                  style={{ marginLeft: "20px" }}
                                >
                                  <strong>
                                    {order?.totalPrice &&
                                      formatToINR(order?.totalPrice)}
                                  </strong>
                                </span>
                              </strong>
                            </p>
                          </div>
                        </div>
                       {isEditFlow && OrderInfoSection(order)}
                      </div>
                    </div>
                  </div>
                 {!isEditFlow && 
                 <div className="col-md-4">
                    <div className="card shadow-none border">
                      <div className="card-body p-4 address-card">
                      {OrderInfoSection(order)}
                      </div>
                    </div>
                  </div>
                  }
                  {isEditFlow && (
                    <div className="col-md-4">
                      <div className="card shadow-none border">
                        <div className="card-body p-4 address-card">
                          {getUpdatePaymentElement()}
                          {getUpdateProcessElement()}
                          <br />
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            onClick={handleUpdateOrder}
                            // disabled={disabled}
                          >
                            Process
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-12">
                  <div className="card shadow-none border">
                    <div className="card-body p-4 address-card">
                      <h5>Order Items:</h5>
                      <div className="orderDetailsCartItemsContainer">
                        {order?.orderItems &&
                          order?.orderItems.map((item) => (
                            <div key={item.product?._id} className="cart-items">
                              <div className="center-item">
                              <img
                              width={56} height={56}
                                src={item?.product?.thumbnail[0]?.url}
                                alt="Product"
                              />
                              <Link to={`/product-detail/${item.product?._id}`}>
                                <h6>{item.name}</h6>
                              </Link>{" "}
                              </div>
                              <h6 className="product-text fw-semibold mb-0">
                                {item.quantity} X ₹{item.price} ={" "}
                                {formatToINR(item.price * item.quantity)}
                              </h6>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
