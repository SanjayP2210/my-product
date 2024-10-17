import React from "react";
import PriceSliderComponent from "../../../components/RangeSlider/PriceSlider";

const PricingFilterSection = ({
  isProductLoaded,
  maximumPrice,
  rangeRef,
  rangeValue,
  setRangeValue,
  handleRangeValue,
}) => {
  return (
    <>
      <h6 className="mt-4 mb-3 mx-4 fw-semibold">By Pricing :</h6>
      <div className="pb-4 px-4">
        <div>
          {maximumPrice && (
            <PriceSliderComponent
              min={0}
              steps={2}
              max={maximumPrice}
              rangeRef={rangeRef}
              rangeValue={rangeValue}
              setRangeValue={setRangeValue}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PricingFilterSection;
