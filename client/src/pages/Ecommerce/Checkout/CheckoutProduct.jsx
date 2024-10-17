/* eslint-disable no-undef */
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../../assets/css/wizard.css";
import CheckoutCard from "./CheckoutCard";
import "../index.css";
import { Wizard, useWizard } from "react-use-wizard";
import CheckoutAddressCard from "./CheckoutAddressCard";
import { getCart } from "../../../reducers/cartReducer";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Payment from "./Payment/Payment";
import ThankYouPage from "./ThankYouCard/ThankYouPage";
import { Header } from "./Header";

const CheckoutProduct = () => {
  const dispatch = useDispatch();
  const { totalPrice, cartItems } = useSelector((state) => state.cart);
  const [paymentInfo, setPaymentInfo] = useState({ isPaymentDone :false});
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [completedStep, setCompletedStep] = useState(0);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCart());
    }
  }, [isLoggedIn]);

  const Step1 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    // Attach an optional handler
    handleStep(() => {
      localStorage.removeItem("shippingInfo");
      setCompletedStep(0);
    });

    return (
      <>
        {cartItems?.length > 0 && <Header completedStep={completedStep} />}
        <section>
          <CheckoutCard nextStep={nextStep} />
        </section>
      </>
    );
  };

  const Step2 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    // Attach an optional handler
    handleStep(() => {
      setCompletedStep(2);
    });

    return (
      <>
        {cartItems?.length > 0 && <Header />}
        <CheckoutAddressCard
          previousStep={previousStep}
          nextStep={nextStep}
          totalPrice={totalPrice}
        />
      </>
    );
  };

  const Step3 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    // Attach an optional handler
    handleStep(() => {
      localStorage.removeItem("shippingInfo");
      setCompletedStep(0);
    });

    return (
      <>
        {cartItems?.length > 0 && <Header />}
        <Payment
          // handleStep={handleStep}
          // previousStep={previousStep}
          // nextStep={nextStep}
          setPaymentInfo={setPaymentInfo}
        />
      </>
    );
  };

  const formRef = useRef(null);

  return (
    <div className="container-fluid checkout">
      <BreadCrumb title={"Checkout"} />
      <div className="checkout">
        <div className="card">
          <div className="card-body p-4">
            {paymentInfo?.isPaymentDone ? (
              <ThankYouPage orderInfo={paymentInfo} />
            ) : (
              <div className="wizard-content">
                <form
                  className="tab-wizard wizard-circle wizard clearfix"
                  ref={formRef}
                >
                  <Wizard>
                    <Step1 />
                    <Step2 />
                    <Step3 />
                  </Wizard>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
