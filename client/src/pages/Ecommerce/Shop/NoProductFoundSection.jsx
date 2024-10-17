import React from "react";
import emptyCardIcon from "../../../assets/images/svgs/empty-shopping-cart-95276f54.svg";

const NoProductFoundSection = ({ resetFilter }) => {
  return (
    // <div className="col-sm-12 col-xxl-12">
    //   <div className="overflow-hidden rounded-2 border no-product-box">
    //     <div
    //       className="position-relative justify-content-center text-center"
    //       style={{ padding: "50px" }}
    //     >
    //       <h5 className="fs-5 mb-0 d-none d-lg-block">No Product Found</h5>
    //     </div>
    //   </div>
    // </div>
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <img src={emptyCardIcon} alt="cart" width="200" />
          <h2 className="h2 mt-3">There is no Product</h2>
          <h6 className="h6">
            The Product you are searching for is no longer available.
          </h6>
          <button
            onClick={resetFilter}
            className="btn btn-primary mt-3"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoProductFoundSection;
