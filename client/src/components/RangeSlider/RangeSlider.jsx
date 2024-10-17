import React, { useEffect, useRef, useState } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import "./index.css";
import { handleNumberValidation } from "../../constants/utilities";

export const RangeSlider = ({
  rangeValue = [50],
  setRangeValue,
  min=0,
  max=100,
  isPricingRange = false,
  steps = 5,
}) => {
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const [rangeArray, setRangeArray] = useState([]);
  useEffect(() => {
    if (min != null && max != null) {
      const stepSize = max / steps;
      const result = [];

      for (let i = 0; i <= steps; i++) {
        result.push(i * stepSize);
      }
      setRangeArray(result);
    }
  }, [min, max]);

  const sliderRef = useRef();

  // useEffect(() => {
  //   const range = rangeRef?.current;
  //   const tooltip = document.getElementById(`slider_tooltip-${id}`);
  //   const tooltipLabel = document.getElementById(`slider_tooltip_label-${id}`);
  //   if (range) {
  //     const updateTooltip = () => {
  //       const value = range?.value;
  //       const percentage =
  //         ((value - range.min) / (range.max - range.min)) * 100;
  //       tooltip.style.left = `calc(${percentage}% + (${
  //         8 - percentage * 0.15
  //       }px))`; // Adjust to align with the thumb
  //       tooltipLabel.textContent = isPricingRange ? value : `${value}%`;
  //     };

  //     // Initial update
  //     updateTooltip();

  //     // Update tooltip on range input change
  //     range.addEventListener("input", updateTooltip);

  //     // Update tooltip on range input change
  //     range.addEventListener("mouseup", function () {
  //       this.blur();
  //     });
  //   }
  // }, [rangeRef]);

    useEffect(() => {
      if (minRef.current) {
        minRef.current.value = rangeValue[0];
      }
    }, [minRef.current, rangeValue]);

    const handleInputChange = (e, index) => {
      const newValue = [...rangeValue];
      newValue[index] = parseInt(e.target.value) || 0;
      setRangeValue(newValue);
      if (sliderRef.current) {
        sliderRef.current.noUiSlider.set(newValue);
      }
    };

    const onUpdate = (values) => {
      setRangeValue(values.map((val) => parseInt(val)));
      minRef.current.value = parseInt(values[0]);
    };
  
  // const onUpdate = (values) => {
  //   setRangeValue(values.map((val) => parseFloat(val).toFixed(2)));
  // };

  return (
    <>
      <div className="range-slider row">
        {rangeArray?.length > 0 && (
          <>
            <div className="col-md-10">
              <Nouislider
                start={rangeValue}
                connect={[true, false]}
                ref={sliderRef}
                range={{
                  min: [min],
                  max: max,
                }}
                tooltips={true}
                behaviour={"smooth-steps-tap"}
                pips={{
                  mode: "values",
                  values: rangeArray || [],
                  density: 4,
                }}
                onSet={onUpdate}
              />
            </div>
            <div
              className="col-md-2 rounded-1"
            >
              <input
                type="text"
                className="form-group form-control ps-2"
                placeholder="0"
                ref={minRef}
                onChange={(e) => {
                  e = handleNumberValidation(e);
                  handleInputChange(e, 0);
                }}
                maxLength={max?.length}
                max={max}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
