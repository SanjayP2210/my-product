import React, { useRef, useState, useEffect } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import "./index.css";
import { handleNumberValidation } from "../../constants/utilities";

function PriceSliderComponent({
  min = 0,
  max = 200,
  setRangeValue,
  rangeValue,
  steps=5
}) {
  let sliderRef = useRef();
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

  useEffect(() => {
    if (minRef.current) {
      minRef.current.value = 0;
    }
    if (maxRef.current) {
      maxRef.current.value = maxRef.current.value ? maxRef.current.value : max;
    }
  }, [minRef.current, maxRef.current]);

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
    maxRef.current.value = parseInt(values[1]);
  };

  return (
    <div className="range-slider">
      {rangeArray?.length > 0 && (
        <>
          <Nouislider
            start={rangeValue}
            connect
            ref={sliderRef}
            range={{
              min: [min],
              max: max,
            }}
            behaviour={"smooth-steps-tap"}
            pips={{
              mode: "values",
              values: rangeArray,
              density: 4,
            }}
            onSet={onUpdate}
          />
          <div
            className="input-group border rounded-1"
            style={{ marginTop: "50px" }}
          >
            <input
              type="text"
              className=" form-group form-control ps-2"
              placeholder="0"
              ref={minRef}
              onChange={handleNumberValidation}
              onBlur={(e) => {
                if (e.target.value > rangeValue[1]) {
                  e.target.value = rangeValue[1];
                }
                handleInputChange(e, 0);
              }}
              maxLength={parseInt(rangeValue[1])?.toString()?.length}
              max={maxRef?.current?.value}
            />
            <input
              type="text"
              className="form-group form-control ps-2"
              placeholder="0"
              ref={maxRef}
              defaultValue={max}
              maxLength={max?.toString()?.length}
              onChange={handleNumberValidation}
              onBlur={(e) => {
                if (e.target.value > max) {
                  e.target.value = max;
                }
                handleInputChange(e, 1);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PriceSliderComponent;
