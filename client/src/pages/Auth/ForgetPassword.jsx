import React, { useState } from 'react';
import Logo from "../../assets/images/logos/Logo.png";
import LoginSlider from "../../assets/images/backgrounds/login-side.png";
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';
import Loader from '../../components/Loader/Loader';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email");
      return
    }
    try {
      setLoading(true);
      const response = await apiService.postRequest("auth/forget-password", {
        email: email,
      });
      if (!response.isError) {
        toast.success(`Mail sent successfully to ${email}`);
      }
      setLoading(false);
    } catch (error) {
      toast.error("error while forget password");
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
                          <p className="text-muted">
                            Please enter the email address associated with your
                            account and We will email you a link to reset your
                            password.
                          </p>
                          <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                              <label
                                htmlFor="text-email"
                                className="form-label"
                              >
                                Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="text-email"
                                placeholder="Enter your email"
                                aria-describedby="emailHelp"
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                              />
                            </div>

                            <button
                              type='submit'
                              className="btn btn-dark w-100 py-8 mb-3 rounded-1"
                            >
                              Forgot Password
                            </button>
                            <NavLink
                              to={'/auth/login'}
                              className="btn bg-primary-subtle text-primary w-100 py-8 rounded-1"
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

export default ForgetPassword