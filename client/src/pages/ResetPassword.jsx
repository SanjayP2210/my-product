import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import apiService from "../service/apiService";
import { getJWTToken } from "../constants/utilities";
import { useSelector } from "react-redux";
import Logo from "../assets/images/logos/Logo.png";

function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const JWTToken = getJWTToken();
  const { loginUserData, isLoggedIn } = useSelector((state) => state.auth);
  const [passType, setPassType] = useState(false);
  const [confirmPassType, setConfirmPassType] = useState(false);
  const [data, setData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!params?.token && !JWTToken) {
      if (JWTToken) {
        setData({ token: params.token });
      } else {
        toast.error("Invalid Token");
        navigate("/");
      }
    } else {
      setData({ token: params.token });
    }
    setLoading(false);
  }, [params]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!data?.password || !data?.confirmPassword){
        toast.error("password and confirm password both are required");
        return;
      }
      if (data?.password !== data?.confirmPassword) {
        toast.error("password and confirm password does not matched");
        return;
      }
      setLoading(true);
      const payload = data;
      if (JWTToken) {
        payload.JWTToken = JWTToken;
        payload.email = loginUserData.email;
      }
      const response = await apiService.postRequest(
        JWTToken ? "user/reset-password" : "auth/reset-password",
        payload
      );
      if (!response.isError) {
        toast.success(response.message);
        setLoading(false);
        navigate("/auth/login");
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error("error while reset password", error);
      setLoading(false);
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
                  <form onSubmit={handleSubmit}>
                    {JWTToken && (
                       <div className="mb-3">
                       <label
                         htmlFor="text-email"
                         className="form-label"
                       >
                         Old password
                       </label>
                       <input
                         className="form-control"
                          type="password"
                          name="oldPassword"
                          placeholder="oldPassword"
                          id="oldPassword"
                          required
                          autoComplete="off"
                          value={data.oldPassword}
                          onChange={handleInput}
                       />
                        <span
                          id="togglePassword"
                          className="eye-icon"
                          onClick={(e) => {
                            const passwordInput =
                              document.getElementById("oldPassword");
                            const type =
                              passwordInput.getAttribute("type") === "password"
                                ? "text"
                                : "password";
                            passwordInput.setAttribute("type", type);

                            // Toggle the eye icon (optional)
                            e.target.textContent =
                              type === "password" ? "👁️" : "👁️‍🗨️";
                          }}
                        >
                          👁️
                        </span>
                     </div>
                    )}
                      <label htmlFor="password" className="form-label">password</label>
                     <div className="input-group border rounded-1 mb-3">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        id="password"
                        autoComplete="off"
                        value={data.password}
                        onChange={handleInput}
                      />
                      <span
                        className="input-group-text bg-transparent px-6 border-0"
                        onClick={()=>{
                          const passwordInput = document.getElementById("password");
                          const passwordType = passwordInput.getAttribute("type") === "password";
                          const type = passwordType ? "text" : "password";
                          passwordInput.setAttribute("type", type);
                          setPassType(!passwordType);
                        }}
                      >
                        <i className={`${passType
                                          ? "ti ti-eye fs-6"
                                          : "ti ti-eye-off fs-6"
                                      }`}></i>
                      </span>
                    </div>

                      <label htmlFor="confirmPassword" className="form-label">confirm password</label>
                    <div className="input-group border rounded-1">
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        autoComplete="off"
                        value={data.confirmPassword}
                        onChange={handleInput}
                      />
                      <span
                        className="input-group-text bg-transparent px-6 border-0"
                        onClick={()=>{
                          const passwordInput = document.getElementById("confirmPassword");
                          const passwordType = passwordInput.getAttribute("type") === "password";
                          const type = passwordType ? "text" : "password";
                          passwordInput.setAttribute("type", type);
                          setConfirmPassType(!passwordType);
                        }}
                      >
                        <i className={`${
                                        confirmPassType
                                          ? "ti ti-eye fs-6"
                                          : "ti ti-eye-off fs-6"
                                      }`}></i>
                      </span>
                    </div>
                    <br />
                    <button type="submit" className="btn btn-dark w-100 py-8 mb-4 rounded-1">
                      Reset Password
                    </button>
                    <NavLink
                              to={'/auth/login'}
                              className="btn bg-primary-subtle text-primary w-100 py-8 mb-4 rounded-1"
                            >
                              Back to Login
                            </NavLink>
                  </form>
                </div>
              </div>
            </div>
          </div>
          </div>
              </div>
            </div>
          </div>
          </div>
    </>
  );
}

export default ResetPassword;
