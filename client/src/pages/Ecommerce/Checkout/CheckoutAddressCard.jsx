import React, { useEffect, useRef, useState } from "react";
import apiService from "../../../service/apiService";
import { toast } from "react-toastify";
import OrderSummaryContent from "./OrderSummaryContent";
import "./../index.css";
import AddAddres from "./AddAddress";
import { useDispatch, useSelector } from "react-redux";
import { setShippingInfo } from "../../../reducers/cartReducer";

const CheckoutAddressCard = ({ previousStep, nextStep, totalPrice }) => {
  const addAddressBtn = useRef();
  const dispatch = useDispatch();

  const [addressData, setAddressData] = useState([]);
  const [selectedAddress, setSelectedAdress] = useState(
    (localStorage.getItem("shippingInfo") &&
      JSON.parse(localStorage.getItem("shippingInfo"))) ||
      false
  );
  const fetchAddress = async () => {
    try {
      const response = await apiService.getRequest("address");
      if (response) {
        if (response.isError) {
          toast.error("error while fetching address", response?.message);
        } else {
          const addresses = response.addresses;
          setAddressData(addresses);
        }
      }
    } catch (error) {
      toast.error("error while fetching address", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleSelectedAddress = (address) => {
    const shippingInfo = {
      city:address?.city,
      country:address?.country,
      mobileNumber:address?.mobileNumber,
      state:address?.state,
      street:address?.street,
      zipCode:address?.zipCode,
      addressId:address?._id,
      countryCode : address?.countryCode
    };
    dispatch(setShippingInfo(shippingInfo));
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    setSelectedAdress(true);
    nextStep();
  };

  return (
    <>
      {" "}
      <section>
        <div className="billing-address-content">
          <div className="row billing-address-block">
            {addressData &&
              addressData?.map((address, index) => {
                return (
                  <>
                    <div key={index} className="col-md-3 col-sm-6">
                      <div className="card shadow-none border">
                        <div className="card-body p-4 address-card">
                          <h6 className="mb-3 fs-4 fw-semibold">
                            {address?.user?.name}
                          </h6>
                          <p className="mb-1 fs-2 form-label">
                            {[
                              address?.street,
                              address?.city,
                              address.state,
                              address.country,
                              address.zipCode,
                            ]?.join()}
                          </p>
                          <h6 className="d-flex align-items-center gap-2 my-4 fw-semibold fs-4">
                            <i className="ti ti-device-mobile fs-7"></i>
                            {address.mobileNumber}
                          </h6>
                          <a
                            href="javascript:void(0)"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectedAddress(address);
                            }}
                            className={`btn btn-outline-primary billing-address ${
                              selectedAddress?.addressId == address?._id
                                ? "active"
                                : ""
                            }`}
                          >
                            Deliver To This Address
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            <div className="col-md-3  col-sm-6">
              <div className="card shadow-none border">
                <div className="card-body address-card center-item">
                  <div className="address-card-box">
                    <div className="empty-address-card-box">
                      <button
                        type="button"
                        className="btn btn-outline-primary billing-address center-item"
                        data-bs-toggle="modal"
                        data-bs-target="#address-modal"
                        ref={addAddressBtn}
                      >
                        <i className="ti ti-plus fs-5"></i>
                        {"  "}
                        Add New Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OrderSummaryContent />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => previousStep()}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-rounded btn-outline-primary ms-6 cursor-pointer"
            onClick={() => nextStep()}
            disabled={!selectedAddress}
          >
            {selectedAddress
              ? "Complete an order"
              : "Select Address to go next"}
          </button>
        </div>
        <AddAddres fetchAddress={fetchAddress} />
      </section>
    </>
  );
};

export default CheckoutAddressCard;
