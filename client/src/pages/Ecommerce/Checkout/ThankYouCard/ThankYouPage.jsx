import React, { useEffect } from "react";
import paymentCompletedGif from "../../../../assets/images/gif/payment-complete-61546c47.gif";
import { toast } from "react-toastify";
import apiService from "../../../../service/apiService";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ThankYouPage = ({ orderInfo }) => {
  const { paymentInfo } = orderInfo;
  const { isOrderUpdated, generatedOrderId } = useSelector(
    (state) => state.order
  );
  console.log("generatedOrderId", generatedOrderId);
  const navigate = useNavigate();
  console.log("paymentInfo", paymentInfo);

  return (
    <div>
      <section className="payment-method text-center">
        <h5 className="fw-semibold fs-5">Thank you for your purchase!</h5>
        <h6 className="fw-semibold text-primary mb-7">
          Your order id: {generatedOrderId}
          <br />
          <span
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/my-order");
            }}
          >
            View your orders: <i className="ti ti-external-link"></i>
          </span>
        </h6>
        <h6 className="fw-semibold text-primary mb-7"></h6>
        {paymentInfo?.typeOfPayment !== "cod" && (
          <img
            src={paymentCompletedGif}
            alt="matdash-img"
            className="img-fluid mb-4"
            width="350"
          />
        )}
        <p className="mb-0 fs-2">
          We will send you a notification
          <br />
          within 2 days when it ships.
        </p>
        <div className="d-sm-flex align-items-center justify-content-between my-4">
          <NavLink className="btn btn-success d-block mb-2 mb-sm-0" to={"/"}>
            Continue Shopping
          </NavLink>
          <a href="javascript:void(0)" className="btn btn-primary d-block">
            Download Receipt
          </a>
        </div>
      </section>
    </div>
  );
};

export default ThankYouPage;
