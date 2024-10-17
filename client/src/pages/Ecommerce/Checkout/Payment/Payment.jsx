import React, { useEffect, useState } from "react";
import apiService from "../../../../service/apiService";
import { toast } from "react-toastify";
import DeliveryOption from "../DeliveryOption";
import PaymentOptions from "./PaymentOptions";
import paypalSvg from "../../../../assets/images/svgs/paypal.svg";
import mastercardSvg from "../../../../assets/images/svgs/mastercard.svg";
import OrderSummaryContent from "../OrderSummaryContent";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetOrderState } from "../../../../reducers/orderReducer";
import { v4 as uuidv4 } from "uuid";
import { getCart } from "../../../../reducers/cartReducer";

const paymentOptions = [
  {
    id: "1",
    value: "paypal",
    label: "Pay with Paypal",
    text: "You will be redirected to PayPal website to complete your purchase securely.",
    image: paypalSvg,
  },
  {
    id: "2",
    value: "cod",
    label: "Cash on Delivery",
    text: "Pay with cash when your order is delivered.",
    image: null,
  },
  {
    id: "3",
    value: "credit/debit",
    label: "Credit / Debit Card",
    text: "We support Mastercard, Visa, Discover and Stripe.",
    image: mastercardSvg,
  },
];
const Payment = ({ setPaymentInfo }) => {
  const dispatch = useDispatch();
  const [stripeApiKey, setStripeApiKey] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("paypal");
  const [orderInfo, setOrderInfo] = useState(null)
  const { cartItems, totalPrice, tax, shippingCharges, shippingInfo } =
    useSelector((state) => state.cart);
  const { isOrderUpdated } = useSelector(
    (state) => state.order
  );
  const getStripeApiKey = async () => {
    const response = await apiService.getRequest("payment/stripe-api-key");
    if (response?.isError) {
      toast.error("Error create payment intent", response?.isError);
    } else {
      const data = await response.striepApiKey;
      console.log("data", data);
      setStripeApiKey(data);
    }
  };

  useEffect(() => {
    getStripeApiKey();
  }, []);

  const generateOrderNumber = () => {
    // Generate a random order number (e.g., 8 digits)
    const prefix = "cod_";
    const fullUuid = uuidv4();
    const randomNumber = fullUuid.substring(0, 34);
    return prefix + randomNumber;
  };

  useEffect(() => {
    if (isOrderUpdated && orderInfo) {
      setPaymentInfo({
        ...orderInfo,
        isPaymentDone: true,
      });
      dispatch(resetOrderState());
      dispatch(getCart());
    }
  }, [isOrderUpdated]);

  const finalPrice = totalPrice + tax + shippingCharges;
  const handleCodOrder = () => {
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
      itemsPrice: parseFloat(totalPrice).toFixed(2),
      totalPrice: parseFloat(finalPrice).toFixed(2),
      taxPrice: parseFloat(tax).toFixed(2),
      shippingPrice: parseFloat(shippingCharges).toFixed(2),
      paymentInfo: {
        id: generateOrderNumber(),
        status: "cod_succeeded",
        typeOfPayment: "cod",
      },
    };
    setOrderInfo(orderDetails);
    dispatch(createOrder(orderDetails));
  };

  return (
    <div className="payment-method-list payment-method">
      <DeliveryOption />
      <PaymentOptions
        paymentOptions={paymentOptions}
        setSelectedPaymentOption={setSelectedPaymentOption}
        selectedPaymentOption={selectedPaymentOption}
        stripeApiKey={stripeApiKey}
        setPaymentInfo={setPaymentInfo}
        setOrderInfo={setOrderInfo}
      />
      <OrderSummaryContent />
      {selectedPaymentOption === "cod" && (
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-rounded btn-outline-primary ms-6 cursor-pointer"
            onClick={handleCodOrder}
          >
            Complete an order
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
