import React from "react";

const SerchProductByIdInput = ({
  productId,
  setProductId,
  handleSearchProduct,
}) => {
  return (
    <div className="center-item m-2">
      {" "}
      <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
        <div className="card w-100">
          <div className="card-body">
            <div className="center-item mb-3">
              <h4 className="card-title mb-0">Search Product By ID</h4>
            </div>
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                onChange={(e) => {
                  setProductId(e.target.value);
                }}
                value={productId}
                placeholder="Enter Product ID"
                maxLength={24}
              />
              <span className="btn btn-primary" onClick={handleSearchProduct}>
                <i className="ti ti-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerchProductByIdInput;
