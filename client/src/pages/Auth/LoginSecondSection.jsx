import React from "react";
import LoginSlider from "../../assets/images/backgrounds/login-side.png";

const LoginSecondSection = () => {
  return (
    <>
      <div className="col-xl-6 d-none d-xl-block">
        <div className="row justify-content-center align-items-start h-100">
          <div className="col-lg-9">
            <div
              id="auth-login"
              className="carousel slide auth-carousel mt-5 pt-4"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#auth-login"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#auth-login"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#auth-login"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="d-flex align-items-center justify-content-center w-100 h-100 flex-column gap-9 text-center">
                    <img
                      src={LoginSlider}
                      alt="login-side-img"
                      width="300"
                      className="img-fluid"
                    />
                    <h4 className="mb-0">Feature Rich 3D Charts</h4>
                    <p className="fs-12 mb-0">
                      Donec justo tortor, malesuada vitae faucibus ac, tristique
                      sit amet massa. Aliquam dignissim nec felis quis
                      imperdiet.
                    </p>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-primary rounded-1"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="d-flex align-items-center justify-content-center w-100 h-100 flex-column gap-9 text-center">
                    <img
                      src={LoginSlider}
                      alt="login-side-img"
                      width="300"
                      className="img-fluid"
                    />
                    <h4 className="mb-0">Feature Rich 2D Charts</h4>
                    <p className="fs-12 mb-0">
                      Donec justo tortor, malesuada vitae faucibus ac, tristique
                      sit amet massa. Aliquam dignissim nec felis quis
                      imperdiet.
                    </p>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-primary rounded-1"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="d-flex align-items-center justify-content-center w-100 h-100 flex-column gap-9 text-center">
                    <img
                      src={LoginSlider}
                      alt="login-side-img"
                      width="300"
                      className="img-fluid"
                    />
                    <h4 className="mb-0">Feature Rich 1D Charts</h4>
                    <p className="fs-12 mb-0">
                      Donec justo tortor, malesuada vitae faucibus ac, tristique
                      sit amet massa. Aliquam dignissim nec felis quis
                      imperdiet.
                    </p>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-primary rounded-1"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSecondSection;
