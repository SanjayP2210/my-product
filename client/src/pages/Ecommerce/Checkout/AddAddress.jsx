import React, { useEffect, useRef, useState } from "react";
import RatingComponent from "../../../components/Rating/RatingComponent";
import InputBox from "../../../components/InputBox/InputBox";
import { FormProvider, useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import Select2 from "../../../components/Select2/Select2";
import i18nZipcodes from "i18n-zipcodes";
import { handleNumberValidation } from "../../../constants/utilities";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiService from "../../../service/apiService";
const AddAddres = ({ fetchAddress }) => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const addressCloseBtnRef = useRef();
  const defaultAddressValue = {
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    mobileNumber: "",
    userId: user?._id,
  };
  const [addressForm, setAddressForm] = useState(defaultAddressValue);

  console.log("addressForm", addressForm);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  useEffect(() => {
    if (Country) {
      const contries = Country.getAllCountries().map(
        ({ isoCode, name }, index) => {
          return { label: name, value: isoCode };
        }
      );
      console.log("contries", contries);
      setCountryList(contries);
    }
  }, []);

  useEffect(() => {
    if (country) {
      const stateData = State.getStatesOfCountry(country.value).map(
        (state) => ({
          value: state.isoCode,
          label: `${state.name}`,
        })
      );
      console.log("stateData", stateData);
      setStateList(stateData);
    } else {
      setStateList([]);
      setCityList([]);
      setState(null);
      setCity(null);
      setAddressForm({
        ...addressForm,
        ["state"]: null,
        ["city"]: null,
      });
      methods.reset({
        ...getValues(),
        ["state"]: null,
        ["city"]: null,
      });
    }
    methods.trigger("country");
  }, [country]);

  useEffect(() => {
    if (state) {
      const cityData = City.getCitiesOfState(country.value, state.value).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      );
      console.log("cityData", cityData);
      setCityList(cityData);
    } else {
      setCityList([]);
      setCity(null);
      setAddressForm({
        ...addressForm,
        ["city"]: null,
      });
      methods.reset({
        ...getValues(),
        ["state"]: null,
        ["city"]: null,
      });
    }
    methods.trigger("state");
  }, [state]);

  const methods = useForm({
    reValidateMode: "onBlur",
    defaultAddressValue,
  });
  const {
    handleSubmit,
    clearErrors,
    reset,
    getValues,
    setError,
    watch,
    register,
    formState: { errors, isValid },
  } = methods;
  console.log("getValues", getValues());
  console.log("errors", errors);

  const handleInput = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setAddressForm({
      ...addressForm,
      [name]: value,
    });
    methods.trigger([name]);
  };

  const checkZipCode = (zipCode) => {
    try {
      setAddressForm({
        ...addressForm,
        ["zipCode"]: zipCode.target.value,
      });
      methods.setValue("zipCode", zipCode.target.value);
      const isValidZipCode = i18nZipcodes(country.value, zipCode.target.value);
      console.log("isValidZipCode", isValidZipCode);
      if (isValidZipCode) {
        clearErrors("zipCode");
      } else {
        setError("zipCode", {
          type: "customer",
          message: "Enter Valid Zip Code",
        });
      }
    } catch (error) {
      setError("zipCode", {
        type: "customer",
        message: "Enter Valid Zip Code",
      });
    }
  };

  const onSubmit = async (event) => {
    console.log("data", addressForm);
    event.preventDefault();
    if (!isValid) {
      methods.trigger();
      return;
    }
    try {
      const formData = new FormData();
      const formObj = {
        ...getValues(),
        country: country?.label,
        state: state?.label,
        city: city?.label,
        user: user?._id,
        countryCode : country?.value,
      };
      const formKeys = Object.keys(formObj);
      formKeys.forEach((key) => {
        const keyValue = formObj[key];
        formData.append(key, keyValue);
      });
      const response = await apiService.postRequest("address", formData);
      if (response?.isError) {
        toast.error("Error adding new address", response?.isError);
      } else {
        toast.success("address added successfully");
        addressCloseBtnRef.current.click();
        fetchAddress();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding new address");
    }
  };
  return (
    <div
      id="address-modal"
      className="modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-dialog modal-dialog-scrollable modal-dialog modal-dialog-centered">
            <div className="modal-content modal-filled">
              <div className="modal-header modal-colored-header bg-primary text-white">
                <h4
                  className="modal-title text-white"
                  id="info-header-modalLabel"
                >
                  Add Address
                </h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="card">
                  <div className="card-body">
                    <div className="mb-3">
                      <InputBox
                        label={"Street"}
                        id="street"
                        name="street"
                        value={addressForm.street}
                        validation={{
                          required: "Street is required",
                          onChange: (e) => handleInput(e),
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <Select2
                        className="form-select mr-sm-2  mb-2"
                        id="inlineFormCustomSelect"
                        options={countryList || []}
                        value={country}
                        isMultiple={false}
                        name={"country"}
                        placeholder={"Select Country"}
                        errors={errors}
                        handleOnChange={(value) => {
                          setAddressForm({
                            ...addressForm,
                            ["country"]: value,
                          });
                          setCountry(value);
                          methods.setValue("country", value);
                        }}
                        {...register(
                          "country",
                          {
                            required: "Country is Required",
                          },
                          {
                            required: true,
                            // value:value
                          }
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        State <span className="text-danger">*</span>
                      </label>
                      <Select2
                        className="form-select mr-sm-2  mb-2"
                        id="inlineFormCustomSelect"
                        options={stateList || []}
                        isMultiple={false}
                        value={state}
                        disabled={!country}
                        errors={errors}
                        name={"state"}
                        placeholder={"Select State"}
                        handleOnChange={(value) => {
                          setAddressForm({
                            ...addressForm,
                            ["state"]: value,
                          });
                          setState(value);
                          methods.setValue("state", value);
                        }}
                        {...register(
                          "state",
                          {
                            required: "State is Required",
                          },
                          {
                            required: true,
                            // value:value
                          }
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        City <span className="text-danger">*</span>
                      </label>
                      <Select2
                        className="form-select mr-sm-2  mb-2"
                        id="inlineFormCustomSelect"
                        options={cityList || []}
                        isMultiple={false}
                        value={city}
                        name={"city"}
                        disabled={!state}
                        errors={errors}
                        placeholder={"Select City"}
                        handleOnChange={(value) => {
                          setAddressForm({
                            ...addressForm,
                            ["city"]: value,
                          });
                          setCity(value);
                          methods.setValue("city", value);
                          methods.trigger("city");
                        }}
                        {...register(
                          "city",
                          { required: "City is Required" },
                          {
                            required: true,
                            // value:value
                          }
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <InputBox
                        label={"Zip Code"}
                        id="zipCode"
                        name="zipCode"
                        value={addressForm.zipCode}
                        maxLength={10}
                        validation={{
                          required: "Zip Code is required",
                          onChange: (e) => checkZipCode(e),
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <InputBox
                        name="mobileNumber"
                        label={"Mobile Number"}
                        className="form-control ps-2"
                        validation={{
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Please enter only numbers",
                          },
                          required: "Mobile Number is required",
                          minLength: {
                            value: 10,
                            message:
                              "Please enter valid 10 digit mobile number",
                          },
                          maxLength: {
                            value: 10,
                            message: "Only 10 Digits Allowed",
                          },
                          onChange: (e) => handleInput(e),
                        }}
                        onChange={(e) => {
                          e = handleNumberValidation(e);
                        }}
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  ref={addressCloseBtnRef}
                  onClick={(e) => {
                    e.preventDefault();
                    reset(defaultAddressValue);
                    clearErrors();
                    setAddressForm(defaultAddressValue);
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddAddres;
