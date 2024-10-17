import React from "react";
import Select2 from "../../../components/Select2/Select2";

const UpdateProcessDropDown = ({
  handleSubmit,
  titleValue,
  optionList,
  value,
  setValue,
  disabled,
}) => {
  return (
      <div>
        <h5>{titleValue}</h5>
        <div>
          <Select2
            value={value}
            options={optionList}
            id="status"
            name="status"
            isMultiple={false}
            handleOnChange={(value) => setValue(value)}
            disabled={disabled}
          ></Select2>
        </div>
      </div>
  );
};

export default UpdateProcessDropDown;
