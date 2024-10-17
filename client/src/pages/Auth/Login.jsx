import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import Logo from "../../assets/images/logos/Logo.png";
import FBIcon from "../../assets/images/svgs/facebook-icon.svg";
import GoogleIcon from "../../assets/images/svgs/google-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getJWTToken, handleNumberValidation, setThemeAttributes } from "../../constants/utilities";
import { toast } from "react-toastify";
import { loginUser, createUser } from "../../reducers/authReducer";
import UploadImage from "../../components/UploadImage/UploadImage";
import Loader from "../../components/Loader/Loader";
import { FormProvider, useForm } from "react-hook-form";
import InputBox from "../../components/InputBox/InputBox";
import LoginSecondSection from "./LoginSecondSection";
import "./index.css";

const Login = () => {
  const methods = useForm({
    reValidateMode: "onBlur",
  });
  const { handleSubmit,clearErrors,reset,getValues,setError ,watch} = methods;
  const { pageName } = useParams();
  const [isLoginFlow, setIsLoginFlow] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getJWTToken();
  const [image, setImage] = useState([]);
  const [isPassType, setIsPassType] = useState(true);
  const mobileRef = useRef(null);
  const { isLoggedIn, loginUserData, loading, error, isUserAdded } =
    useSelector((state) => state.auth);

  // useEffect(() => {
  // }, [getValues]);

  useEffect(() => {
    if (pageName) {
      const isLogin = pageName === "login";
      setIsLoginFlow(isLogin);
      if (!isLogin) {
        // setUser({
        //   ...user,
        //   name: "",
        //   mobileNumber: "",
        //   image: [],
        // });
      }
      clearErrors();
    }
  }, [pageName,clearErrors]);

  useEffect(() => {
    if (!loading && isLoggedIn && loginUserData && token) {
      console.log("loginUserData", loginUserData);
      if (loginUserData?.themeColor != 'light') {
        setThemeAttributes("dark", "dark-logo", "light-logo", "moon", "sun");
      } else {
        setThemeAttributes("light", "light-logo", "dark-logo", "sun", "moon");
      }
      resetForm();
      if (loginUserData?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [loginUserData, token, isLoggedIn, loading]);

  useEffect(() => {
    if (!loading && isUserAdded) {
      resetForm();
      navigate("/auth/login");
    }
  }, [isUserAdded, loading]);

  // const handleInput = (e) => {
  //   const { name, value } = e.target;
  //   setUser({
  //     ...user,
  //     [name]: value,
  //   });
  // };

  const resetForm = () => {
    // setUser({
    //   email: "",
    //   password: "",
    //   mobileNumber: "",
    //   name: "",
    //   image: [],
    // });
    clearErrors();
    reset();
    setImage([]);
  };

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      if(isLoginFlow){
        delete data.name;
        delete data.mobileNumber;
      }else{
        if (image?.length === 0) {
          toast.error("upload profile picture");
          return;
        }
      }
      const formData = new FormData();
      const formKeys = Object.keys(data);
      formKeys.forEach((key) => {
        const keyValue = data[key];
        formData.append(key, keyValue);
      });
      if (!isLoginFlow) {
        formData.append("image", JSON.stringify(image));
      }
      dispatch(isLoginFlow ? loginUser(formData) : createUser(formData));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Loader visible={loading} />
      <div id="main-wrapper login-form">
        <div className="position-relative overflow-hidden auth-bg min-vh-100 w-100 d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="row justify-content-center w-100 my-5 my-xl-0">
              <div className="col-md-4 login-form-box d-flex flex-column justify-content-center">
                <div className="card mb-0 bg-body auth-login m-auto w-100">
                  {/* <div className="row"> */}
                    {/* <div className="col-xl-6"> */}
                      <div className="row justify-content-center py-3">
                        <div className="col-lg-11">
                          <div className="card-body">
                            <NavLink
                              to="/"
                              className="text-nowrap logo-img d-block mb-4 w-100 text-center"
                            >
                              <img
                                src={Logo}
                                className="dark-logo"
                                alt="Logo-Dark"
                              />
                            </NavLink>
                            {/* <h2 className="lh-base mb-4">
                              Let`s get you signed in
                            </h2> */}
                            {/* <div className="row">
                              <div className="col-6 mb-2 mb-sm-0">
                                <a
                                  className="btn btn-white shadow-sm text-dark link-primary border fw-semibold d-flex align-items-center justify-content-center rounded-1 py-6"
                                  href="javascript:void(0)"
                                  role="button"
                                >
                                  <img
                                    src={FBIcon}
                                    alt="matdash-img"
                                    className="img-fluid me-2"
                                    width="18"
                                    height="18"
                                  />
                                  &nbsp; Facebook
                                </a>
                              </div>
                              <div className="col-6">
                                <a
                                  className="btn btn-white shadow-sm text-dark link-primary border fw-semibold d-flex align-items-center justify-content-center rounded-1 py-6"
                                  href="javascript:void(0)"
                                  role="button"
                                >
                                  <img
                                    src={GoogleIcon}
                                    alt="matdash-img"
                                    className="img-fluid me-2"
                                    width="18"
                                    height="18"
                                  />
                                  &nbsp; Google
                                </a>
                              </div>
                            </div> */}
                            {/* <div className="position-relative text-center my-4">
                              <p className="mb-0 fs-12 px-3 d-inline-block bg-body z-index-5 position-relative">
                                Or sign in with email
                              </p>
                              <span className="border-top w-100 position-absolute top-50 start-50 translate-middle"></span>
                            </div> */}
                            <FormProvider {...methods}>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoginFlow && (
                                  <>
                                    <div className="mb-3">
                                      <InputBox
                                        label={"Name"}
                                        className="form-control border-0 ps-2"
                                        id="name"
                                        name="name"
                                        validation={{
                                          required: "Name is required",
                                        }}
                                        inputGroupProps={{
                                          iconClassName: "ti ti-user fs-6",
                                        }}
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <InputBox
                                        // type={"text"}
                                        name="mobileNumber"
                                        label={"Mobile Number"}
                                        className="form-control border-0 ps-2"
                                        ref={mobileRef}
                                        inputGroupProps={{
                                          iconClassName: "ti ti-phone fs-6",
                                        }}
                                        validation={{
                                          pattern: {
                                            value: /^[0-9]*$/,
                                            message:
                                              "Please enter only numbers",
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
                                        }}
                                        onChange={(e) => {
                                          e = handleNumberValidation(e);
                                        }}
                                        maxLength={10}
                                      />
                                    </div>
                                  </>
                                )}
                                <div className="mb-3">
                                  <InputBox
                                    label={"Email Address"}
                                    className="form-control border-0 ps-2 email-inputmask"
                                    name="email"
                                    id="email-mask"
                                    inputGroupProps={{
                                      iconClassName: "ti ti-mail fs-6",
                                    }}
                                    validation={{
                                      required: "Email is required",
                                      pattern: {
                                        value:
                                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Enter a valid email address",
                                      },
                                    }}
                                  />
                                </div>
                                <div className="mb-4">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <label
                                      htmlFor="password"
                                      className="form-label"
                                    >
                                      Password
                                    </label>
                                    <NavLink
                                      to="/auth/forget-password"
                                      className="text-primary link-dark fs-2"
                                    >
                                      Forgot Password ?
                                    </NavLink>
                                  </div>
                                  <InputBox
                                    type={isPassType ? "password" : "text"}
                                    className="form-control border-0 ps-2"
                                    name="password"
                                    validation={{
                                      required: "Password is required",
                                    }}
                                    inputGroupProps={{
                                      iconClassName: `${
                                        isPassType
                                          ? "ti ti-eye-off fs-6"
                                          : "ti ti-eye fs-6"
                                      }`,
                                      iconClick: () => {
                                        setIsPassType(!isPassType);
                                      },
                                    }}
                                  />
                                </div>
                               {isLoginFlow && <div className="d-flex align-items-center justify-content-between mb-4">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input primary"
                                      type="checkbox"
                                      value=""
                                      id="flexCheckChecked"
                                      checked
                                    />
                                    <label
                                      className="form-check-label text-dark"
                                      htmlFor="flexCheckChecked"
                                    >
                                      Keep me logged in
                                    </label>
                                  </div>
                                </div>}
                                {!isLoginFlow && (
                                  <div className="mb-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <label
                                        htmlFor="exampleInputEmail1"
                                        className="form-label"
                                      >
                                        Profile Picture
                                      </label>
                                      <UploadImage
                                        multiple={false}
                                        setImage={setImage}
                                        data={image}
                                      />
                                    </div>
                                  </div>
                                )}
                                <button
                                  className="btn btn-dark w-100 py-8 mb-4 rounded-1"
                                  type="submit"
                                >
                                  {!isLoginFlow ? "Sign Up" : "Sign In"}
                                </button>
                                <div className="d-flex align-items-center">
                                  <p className="fs-12 mb-0 fw-medium">
                                  {isLoginFlow ? "Don’t have an account yet?" :
                                  "Already have an Account?"}
                                  </p>
                                  <NavLink
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setIsLoginFlow(!isLoginFlow);
                                      navigate(
                                        isLoginFlow
                                          ? "/auth/register"
                                          : "/auth/login"
                                      );
                                    }}
                                    className="text-primary fw-bolder ms-2"
                                  >
                                    {isLoginFlow ? "Sign Up" : "Sing In"} Now
                                  </NavLink>
                                </div>
                              </form>
                            </FormProvider>
                          </div>
                        </div>
                      </div>
                    {/* </div> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
