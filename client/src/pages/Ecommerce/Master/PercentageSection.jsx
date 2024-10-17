import React from 'react'
import { RangeSlider } from '../../../components/RangeSlider/RangeSlider';

const PercentageSection = ({
  selectedOption,
  rangeRef,
  setPriceValue,
  priceValue,
}) => {
  return (
    <div>
      <div
        className={`tab-pane fade mt-7 ${
          selectedOption == "percentage" ? "active show" : ""
        }`}
        id="nav-profile"
        role="tabpanel"
        aria-labelledby="nav-profile-tab"
        tabIndex="0"
      >
        <div className="mt-3">
          <div className="form-group">
            <label className="form-label">
              Set Discount Percentage <span className="text-danger">*</span>
            </label>
            <div style={{ marging: "30px 10px" }}>
              <RangeSlider
                rangeRef={rangeRef}
                rangeValue={priceValue}
                setRangeValue={setPriceValue}
                id={"priceValue"}
                min={0}
                max={100}
              />
            </div>
            <br />
            <p className="fs-2">
              Set a percentage discount to be applied on this product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageSection