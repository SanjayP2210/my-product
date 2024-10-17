import React from 'react'
import { useSelector } from 'react-redux';
import { formatToINR } from '../../../constants/utilities';

const OrderSummaryContent = () => {
  const { totalPrice, totalDiscount, tax, shippingCharges } = useSelector(
    (state) => state.cart
  );
  const finalPrice = totalPrice + tax + shippingCharges;
  return (
    <>
      <div className="order-summary border rounded p-4 my-4">
        <div className="p-3">
          <h5 className="fs-5 fw-semibold mb-4">Order Summary</h5>
          <div className="d-flex justify-content-between mb-3">
            <p className="mb-0 fs-3">Sub Total</p>
            <h6 className="mb-0 fs-3 fw-semibold">{formatToINR(totalPrice)}</h6>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <p className="mb-0 fs-3">Total Discount</p>
            <h6 className="mb-0 fs-3 fw-semibold text-danger">
              {formatToINR(totalDiscount)}
            </h6>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <p className="mb-0 fs-3">GST</p>
            <h6 className="mb-0 fs-3 fw-semibold">{formatToINR(tax)}</h6>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <p className="mb-0 fs-3">Shipping</p>
            <h6 className="mb-0 fs-3 fw-semibold">
              {shippingCharges ? formatToINR(shippingCharges) : "Free"}
            </h6>
          </div>
          <div className="d-flex justify-content-between">
            <h6 className="mb-0 fs-4 fw-semibold">Total</h6>
            <h6 className="mb-0 fs-4 fw-semibold">{formatToINR(finalPrice)}</h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSummaryContent