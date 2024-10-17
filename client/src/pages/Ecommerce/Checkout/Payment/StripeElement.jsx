import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./index.css";
import apiService from "../../../../service/apiService";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { formatToINR } from "../../../../constants/utilities";
import { createOrder } from "../../../../reducers/orderReducer";

const StripeElement = ({ setOrderInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { cartItems, totalPrice, tax, shippingCharges, shippingInfo } =
    useSelector((state) => state.cart);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const finalPrice = totalPrice + tax + shippingCharges;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cardFilled, setCardFilled] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const response = await apiService.postRequest("payment/process-payment", {
      amount: Math.round(parseFloat(finalPrice).toFixed(2) * 100),
    });
    if (response?.isError) {
      toast.error("Error create payment intent", response?.isError);
      setLoading(false);
    } else {
      const clientSecretkey = await response.clientSecret;
      console.log("clientSecretkey", clientSecretkey);
      setClientSecret(clientSecretkey);
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecretkey, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
              address: {
                line1: shippingInfo.street,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.pinCode,
                country: shippingInfo.countryCode,
              },
            },
          },
        });
      console.log("paymentIntent", paymentIntent);
      console.log("stripeError", stripeError);
      if (stripeError) {
        setError(stripeError.message);
        setSuccess(null);
        setLoading(false);
      } else {
        if (paymentIntent.status === "succeeded") {
          setLoading(false);
          setSuccess("Payment successful!");
          setError(null);
          const orderItems = cartItems.map(
            ({ _id, productName, price, quantity, productId }, index) => {
              return {
                cartId: _id,
                name: productName,
                price,
                quantity,
                product: productId,
              };
            }
          );
          const orderDetails = {
            shippingInfo,
            orderItems,
            orderId: paymentIntent.id,
            itemsPrice: parseFloat(totalPrice).toFixed(2),
            totalPrice: parseFloat(finalPrice).toFixed(2),
            tax: parseFloat(tax).toFixed(2),
            shippingCharges: parseFloat(shippingCharges).toFixed(2),
            paymentInfo: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              typeOfPayment: "stripe",
            },
          };
          setOrderInfo(orderDetails);
          dispatch(createOrder(orderDetails));
        }
      }
    }
  };

  const style = {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  const handleChange = (event) => {
    setCardFilled(event.complete);
    if (event.error) {
      setError(event.error.message); // Show error message if there's an error
    } else {
      setError(""); // Clear error message if input is valid
    }
  };

  return (
    <>
      <Loader visible={loading} />
      <div className="stipe-form">
        <form>
          <div className="card-box">
            <CardElement
              onReady={(e) => {
                console.log("CardNumberElement [ready]", e);
              }}
              onChange={(event) => {
                console.log("CardNumberElement [change]", event);
                handleChange(event);
              }}
              className="card-element"
              options={{
                style,
                hidePostalCode: true, // This hides the ZIP code field
              }}
            />
            {error && <div className="text-danger error-msg">{error}</div>}
            {success && <div style={{ color: "green" }}>{success}</div>}
          </div>
          <div className="loader-btn center-item">
            <button
              className="btn btn-primary mt-3  center-item"
              type="button"
              disabled={!cardFilled || loading}
              onClick={handleSubmit}
            >
              Pay - {formatToINR(finalPrice)} {"  "}
              {loading && <span className="btn-loader"> </span>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StripeElement;
