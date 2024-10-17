import React from 'react'

const QTYSection = ({ quantity, handleQuantity, productDetail }) => {
  return (
    <div className="d-flex align-items-center gap-7 pb-7 mb-7 border-bottom">
      <h6 className="mb-0 fs-4 fw-semibold">QTY:</h6>
      <div className="input-group input-group-sm rounded">
        <button
          className="btn minus min-width-40 py-0 border-end border-muted fs-5 border-end-0 color-black count-buttons"
          type="button"
          id="add1"
          disabled={quantity === 1}
          onClick={(e) => {
            e.preventDefault();
            handleQuantity("-");
          }}
        >
          <i className="ti ti-minus"></i>
        </button>
        <input
          readOnly={true}
          type="text"
          className="min-width-40 flex-grow-0 border border-muted fs-4 fw-semibold form-control text-center qty count-buttons"
          placeholder=""
          aria-label="Example text with button addon"
          aria-describedby="add1"
          value={quantity}
        />
        <button
          className="btn min-width-40 py-0 border border-muted fs-5 border-start-0 add color-black count-buttons"
          type="button"
          id="addo2"
          disabled={quantity === productDetail?.stock}
          onClick={(e) => {
            e.preventDefault();
            handleQuantity("+");
          }}
        >
          <i className="ti ti-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default QTYSection