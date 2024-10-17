import React from "react";
import { RangeSlider } from "../../../components/RangeSlider/RangeSlider";
import PercentageSection from "./PercentageSection";

const DiscountSection = ({
  selectedOption,
  setSelectedOption,
  rangeRef,
  priceValue,
  setPriceValue,
  fixedDiscount,
  setFixedDiscount,
}) => {
  return (
    <div className="mb-7">
      <label className="form-label">Discount Type</label>
      <nav>
        <div
          className="nav nav-tabs justify-content-between align-items-center gap-9"
          id="nav-tab"
          role="tablist"
        >
          <label
            htmlFor="radio1"
            className="form-check-label form-check p-3  border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
            id="customControlValidation2 nav-contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-home"
            aria-controls="nav-home"
          >
            <input
              type="radio"
              className="form-check-input"
              name="discountType"
              id="radio1"
              value={"no_discount"}
              checked={selectedOption == "no_discount"}
              onChange={(e) => {
                setSelectedOption(e?.target?.value);
              }}
            />
            <span className="fs-4 text-dark">No Discount</span>
          </label>
          <label
            htmlFor="radio2"
            className="form-check-label p-3 form-check border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
            id="customControlValidation2 nav-contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            aria-controls="nav-profile"
          >
            <input
              type="radio"
              className="form-check-input"
              name="discountType"
              id="radio2"
              value={"percentage"}
              checked={selectedOption === "percentage"}
              onChange={(e) => {
                setSelectedOption(e?.target?.value);
              }}
            />
            <span className="fs-4 text-dark">Percentage %</span>
          </label>
          <label
            htmlFor="radio3"
            className="form-check-label form-check p-3 border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
            id="customControlValidation2 nav-contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-contact"
            aria-controls="nav-contact"
          >
            <input
              type="radio"
              className="form-check-input"
              name="discountType"
              id="radio3"
              value={"fixed_price"}
              checked={selectedOption === "fixed_price"}
              onChange={(e) => {
                setSelectedOption(e?.target?.value);
              }}
            />
            <span className="fs-4 text-dark">Fixed Price</span>
          </label>
        </div>
      </nav>
      <div className="tab-content">
        <div
          className={`tab-pane fade mt-7 ${
            selectedOption == "percentage" ? "active show" : ""
          }`}
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
          tabIndex="0"
        >
          <PercentageSection
            selectedOption={selectedOption}
            rangeRef={rangeRef}
            setPriceValue={setPriceValue}
            priceValue={priceValue}
          />
        </div>
        <div
          className={`tab-pane fade mt-7 ${
            selectedOption == "fixed_price" ? "active show" : ""
          }`}
          id="nav-contact"
          role="tabpanel"
          aria-labelledby="nav-contact-tab"
          tabIndex="0"
        >
          <div className="mb-7">
            <label className="form-label">
              Fixed Discounted Price <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={fixedDiscount}
              className="form-control"
              placeholder="Discounted Price"
              onChange={(e) => {
                setFixedDiscount(e.target.value);
              }}
            />
            <p className="fs-2">
              Set the discounted product price. The product will be reduced at
              the determined fixed price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;
