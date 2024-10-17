import React from 'react'

const BuyNowSection = ({
  setIsBuyNowClicked,
  handleAddToCart,
  productDetail,
}) => {
  return (
    <div className="d-sm-flex align-items-center gap-6 pt-8 mb-7">
      <a
        href="javascript:void(0)"
        className="btn d-block btn-primary px-5 py-8 mb-6 mb-sm-0"
        onClick={(e) => {
          e.preventDefault();
          setIsBuyNowClicked(true);
          handleAddToCart(productDetail, true);
        }}
      >
        Buy Now
      </a>
      <a
        href="javascript:void(0)"
        className="btn d-block btn-danger px-7 py-8"
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(productDetail);
        }}
      >
        Add to Cart
      </a>
    </div>
  );
};

export default BuyNowSection