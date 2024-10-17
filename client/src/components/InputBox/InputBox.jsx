import React from "react";
import { useFormContext } from "react-hook-form";
import { handleNumberValidation } from "../../constants/utilities";

const ErrorMsg = ({ inputName, errors }) => (
  <>
    {errors[inputName] && (
      <div style={{ textAlign: "right", marginBottom: "-1rem" }}>
        <small className="text-danger error-msg">
          <strong>
            {errors[inputName]["message"]
              ? errors[inputName]["message"]
              : `${inputName} is required`}
          </strong>
        </small>
      </div>
    )}
  </>
);

const InputBox = ({
  type = "text",
  // value,
  placeholder = "",
  maxLength,
  min = 0,
  className = "form-control",
  name,
  id,
  inputGroupProps = {},
  label,
  validation,
  onChange,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  console.log("error", errors);

  const { iconClassName, iconClick } = inputGroupProps;

  const inputElement = () => {
    return (
      <>
        <input
          type={type}
          id={name}
          placeholder={placeholder}
          className={className}
          autoComplete="off"
          name={name}
          maxLength={maxLength}
          {...register(name, validation, {
            required: true,
            // value:value
          })}
          {...rest}
        />
      </>
    );
  };
  return (
    <>
      {Object.entries(inputGroupProps)?.length > 0 ? (
        <>
          {label && (
            <label htmlFor={name} className="form-label">
              {label} <span className="text-danger">*</span>
            </label>
          )}{" "}
          <div className="input-group border rounded-1">
            <span
              className="input-group-text bg-transparent px-6 border-0"
              id="basic-addon1"
              onClick={iconClick}
            >
              <i className={iconClassName}></i>
            </span>

            {inputElement()}
          </div>
        </>
      ) : (
        <>
          {label && (
            <label htmlFor={name} className="form-label">
              {label} <span className="text-danger">*</span>
            </label>
          )}{" "}
          {inputElement()}
        </>
      )}
      {errors && errors?.[name] && (
        <ErrorMsg errors={errors} inputName={name} />
      )}
    </>
  );
};

export default InputBox;
