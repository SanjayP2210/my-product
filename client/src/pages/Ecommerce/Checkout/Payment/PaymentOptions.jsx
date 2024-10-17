import React from "react";
import paymentSVG from "../../../../assets/images/products/payment.svg";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeElement from "./StripeElement";

const PaymentOptions = ({
  paymentOptions,
  setSelectedPaymentOption,
  selectedPaymentOption,
  stripeApiKey,
  setOrderInfo,
}) => {
  const getStripeElement = (
    <div className="position-relative w-100 ps-0 mt-3">
      <Elements stripe={loadStripe(stripeApiKey)}>
        <StripeElement
          stripeApiKey={stripeApiKey}
          setOrderInfo={setOrderInfo}
        />
      </Elements>
    </div>
  );
  return (
    <div className="payment-option btn-group-active  card shadow-none border">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-semibold fs-4">Payment Option</h6>
        <div className="row">
          <div className="col-lg-8">
            <div
              className="btn-group flex-column"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              {paymentOptions?.map((pop) => {
                return (
                  <>
                    <div
                      className="position-relative mb-3 w-100 form-check btn-custom-fill ps-0"
                      onClick={(e) => setSelectedPaymentOption(pop?.value)}
                    >
                      <input
                        type="radio"
                        className="form-check-input ms-4 round-16"
                        name={`paymentType1${pop?.id}`}
                        id={`btnradio3${pop?.id}`}
                        autoComplete="off"
                        onClick={(e) => setSelectedPaymentOption(pop?.value)}
                        value={pop?.value}
                        checked={pop?.value === selectedPaymentOption}
                      />

                      <label
                        className="btn btn-outline-primary mb-0 p-3 rounded ps-5 w-100"
                        htmlFor="btnradio3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="text-start ps-2">
                            <h6 className="fs-4 fw-semibold mb-0">
                              {pop?.label}
                            </h6>
                            <p className="mb-0 text-muted">{pop?.text}</p>
                          </div>
                          {pop?.image && (
                            <img
                              src={pop?.image}
                              alt="matdash-img"
                              className="img-fluid ms-auto"
                            />
                          )}
                        </div>
                        {selectedPaymentOption === "credit/debit" &&
                          pop?.value === "credit/debit" &&
                          stripeApiKey &&
                          getStripeElement}
                      </label>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="col-lg-4">
            <img src={paymentSVG} alt="matdash-img" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
