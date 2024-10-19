import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart, removeFromCart, removeFullProductFromCart } from "../../../reducers/cartReducer";
import emptyCardIcon from "../../../assets/images/svgs/empty-shopping-cart-95276f54.svg";
import { useNavigate } from "react-router-dom";
import { formatToINR } from "../../../constants/utilities";
import OrderSummaryContent from "./OrderSummaryContent";

const CheckoutCard = ({ nextStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    cartItems,
    isProductRemoveFromCart,
    isCartUpdated,
    isLoading,
    totalCount,
    totalDiscount,
    totalPrice,
  } = useSelector((state) => state.cart);
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);

  const handleAddToCart = (id) => {
    let limitExist = false;
    const product = cartItems.find((item) => item.productId.toString() === id);
    if (product?.productId) {
      limitExist = product?.quantity === product?.stock;
    }
    if (limitExist) return;
    const formData = {
      productId: product._id,
      quantity: 1,
      price: product?.updatedPrice,
      productName: product?.productName,
      image: product?.image,
      stock: product?.stock,
      updatedPrice: product?.updatedPrice,
    };
    dispatch(addToCart(formData));
  };

  // useEffect(() => {
  //   if (isProductRemoveFromCart) {
  //     dispatch(getCart());
  //   }
  // }, [isProductRemoveFromCart]);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <>
      {cartItems?.length === 0 ? (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <img
                src={emptyCardIcon}
                alt="cart"
                width="200px"
                className="img-fluid"
              />
              <h5 className="mt-3">Cart is Empty</h5>
              <button
                className="btn btn-primary mt-3"
                type="button"
                id="go-to-shopping"
                onClick={(e) => {
                  e.preventDefault();
                  isAdmin ? navigate("/admin/shop") : navigate("/")
                }}
              >
                Go back to Shopping
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive scroll-bar">
            <table className="table align-middle text-nowrap mb-0">
              <thead className="fs-2">
                <tr>
                  <th>
                    <h6> Product</h6>
                  </th>
                  <th>
                    <h6>Quantity </h6>
                  </th>
                  <th className="text-end">
                    <h6>Price </h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((product) => {
                  return (
                    <>
                      <tr key={product?._id}>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-3 overflow-hidden">
                            <div
                              className="cart-product-image"
                              onClick={() => {
                                navigate(
                                  `product-detail/${product?._id}`
                                );
                              }}
                            >
                              <img
                                src={product?.image}
                                alt="matdash-img"
                                className="img-fluid rounded"
                                width="80"
                              />
                            </div>
                            <div className="cart-product-name">
                              <h6 className="fw-semibold fs-4 mb-0">
                                {product?.productName}
                              </h6>
                              {product?.categories?.length && (
                                <p className="mb-0">
                                  {product?.categories?.map((categ, index1) => {
                                    return (
                                      <>
                                        {index1 + 1 !=
                                        product?.categories?.length
                                          ? `${categ}, `
                                          : categ}
                                      </>
                                    );
                                  })}
                                </p>
                              )}
                              <a
                                href="javascript:void(0)"
                                className="text-danger fs-4"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(
                                    removeFullProductFromCart(product?._id)
                                  );
                                }}
                              >
                                <i className="ti ti-trash"></i>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <div className="input-group input-group-sm flex-nowrap rounded">
                            <button
                              className="btn btn-outline-primary btn-sm minus-button"
                              type="button"
                              id={product?._id}
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveFromCart(product?._id);
                              }}
                            >
                              <i className="ti ti-minus"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <b>{product?.quantity}</b>
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm plus-button"
                              type="button"
                              id={product?._id}
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product?._id);
                              }}
                              disabled={product?.quantity === product?.stock}
                            >
                              <i className="ti ti-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="text-end border-bottom-0">
                          <h6 className="fs-4 fw-semibold mb-0">
                            {formatToINR(product?.price * product?.quantity)}
                          </h6>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <OrderSummaryContent />
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-primary ms-6 cursor-pointer"
              onClick={() => nextStep()}
            >
              Checkout{" "}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutCard;
