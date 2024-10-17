import React from "react";
import { NavLink } from "react-router-dom";
import { formatToINR } from "../../../constants/utilities";
import RatingComponent from "../../../components/Rating/RatingComponent";
import ProductCard from "../ProductCard/ProductCard";

const ShopProductList = ({ product, index, handleAddToCart }) => {
  return (
    <div key={index} className="col-sm-6 col-xxl-4 col-md-4">
      {/* <div className="card overflow-hidden rounded-2 border">
        <div className="position-relative">
          <NavLink
            to={`product-detail/${product?._id}`}
            className="hover-img d-block overflow-hidden"
          >
            <img
              src={product?.image}
              className="card-img-top rounded-0 product-img"
              alt="matdash-img"
            />
          </NavLink>
          <a
            href="javascript:void(0)"
            className="text-bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Add To Cart"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(product);
            }}
          >
            <i className="ti ti-basket fs-4"></i>
          </a>
        </div>
        <div className="card-body pt-3 p-4 product-text-body">
          <h6 className="fw-semibold fs-4 product-name-tag">
            {product?.productName}
          </h6>
          <div>
            <h6 className="fw-semibold fs-4 mb-0">
              {formatToINR(
                product?.updatedPrice
                  ? product.updatedPrice
                  : product?.basePrice
              )}
              {product.updatedPrice && (
                <span className="ms-2 fw-normal text-muted fs-3">
                  <del>{formatToINR(product?.basePrice)}</del>
                </span>
              )}
            </h6>
            <RatingComponent
              rating={product?.ratings}
              readOnly={true}
              size={20}
            />
          </div>
        </div>
      </div> */}
      <ProductCard 
      product={product}
      handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ShopProductList;
