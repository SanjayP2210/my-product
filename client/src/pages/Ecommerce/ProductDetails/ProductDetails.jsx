import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../../service/apiService";
import RatingComponent from "../../../components/Rating/RatingComponent";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import RelatedProducts from "./RelatedProducts";
import { addToCart } from "../../../reducers/cartReducer";
import { addToCartInfoToast, formatToINR } from "../../../constants/utilities";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import ColorSections from "./ColorSections";
import QTYSection from "./QTYSection";
import BuyNowSection from "./BuyNowSection";
import DescriptionReviewSection from "./DescriptionReviewSection";
import AddReview from "./AddReview";
import Slick from "../../../components/OwlCarousel/Slick";
import './index.css'

const ProductDetails = () => {
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState({});
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewList, setReviewList] = useState([]);
  const [isUserReviewed, setIsUserReviewed] = useState([]);
  const [isBuyNowClicked, setIsBuyNowClicked] = useState(false);
  const reviewTabButtonRef = useRef();
  const addReviewBtn = useRef();
  const productDetailsRef = useRef();
  const dispatch = useDispatch();
  const { cartItems, isCartUpdated } = useSelector((state) => state.cart);
  const {
    _id = "",
    productName = "",
    basePrice = "",
    updatedPrice = "",
    categories = "",
    variants = [],
    description = "",
    images = [],
    status = "",
    numOfReviews = 0,
    ratings = 0,
    stock,
    reviews = [],
    colors
  } = productDetail;
  console.log("productDetail", productDetail);
  // const colors = variants?.value
  //   ? [variants?.value]
  //   : typeof variants === "object"
  //   ? []
  //   : variants?.map((x) => x.value);
  const reviewCloseBtnRef = useRef(null);
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const handleQuantity = (type) => {
    if (type === "+") {
      setQuantity(quantity + 1);
    } else {
      setQuantity(quantity === 1 ? 1 : quantity - 1);
    }
  };
  const fetchProductDetails = async (productId) => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequest(
        `product/get-single-product/${productId}`
      );
      if (response?.isError) {
        setIsLoading(false);
        toast.error(response?.message);
      } else {
        setProductDetail(response.productData);
        setIsLoading(false);
        fetchReview();
      }
    } catch (error) {
      console.log("error fetching product details", error);
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
    productId: productId,
    userId: user?._id,
  });

  useEffect(() => {
    if (reviewList?.length > 0 && productDetail?.productName) {
      const { productDetails } = reviewList[0];
      const { ratings, numOfReviews } = productDetails;
      setProductDetail({
        ...productDetail,
        numOfReviews,
        ratings,
      });
      const userReviewed = reviewList.filter(
        (rev) => rev.userDetails?._id === user?._id
      );
      setIsUserReviewed(userReviewed);
    }
  }, [reviewList]);

  const handleAddToCart = (product,fromBuyNow) => {
    if (!isLoggedIn) {
      toast.warn('You must be logged in to process further');
      navigate("/auth/login");
      return;
    }
    let limitExist = false;
    if (cartItems && cartItems?.length > 0) {
      const isExist = cartItems.find(
        (item) => item.productId.toString() === product._id
      );
      if (isExist?.productId) {
        limitExist = isExist?.quantity === isExist?.stock;
      }
    }
    if (limitExist) {
      if (fromBuyNow) {
        navigate("/checkout-product");
        setIsBuyNowClicked(false);
      }
      return;
    }
    const formData = {
      productId: product._id,
      quantity: quantity,
      price: product?.updatedPrice,
      productName: product?.productName,
      image: product?.thumbnail?.[0]?.url,
      stock: product?.stock,
      updatedPrice: product?.updatedPrice,
    };
    dispatch(addToCart(formData));
  };

  const fetchReview = async () => {
    try {
      const response = await apiService.getRequest(
        `review/product/${productId}`
      );
      if (response.isError) {
        toast.error("Error fetching review", response.message);
      } else {
        setReviewForm({
          ...reviewForm,
          rating: 0,
          comment: "",
        });
        const { reviews } = response;
        setReviewList(reviews);
        // eslint-disable-next-line no-undef
        $(window).scrollTop({ behavior: "smooth" });
      }
    } catch (error) {
      toast.error("Error adding new review", error);
    }
  };

  const addNewReview = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const formKeys = Object.keys(reviewForm);
      formKeys.forEach((key) => {
        const keyValue = reviewForm[key];
        formData.append(key, keyValue);
      });
      const response = await apiService.postRequest("review", formData);
      if (response?.isError) {
        toast.error("Error adding new review", response?.isError);
      } else {
        toast.success("review added successfully");
        reviewCloseBtnRef.current.click();
        fetchReview();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding new review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const response = await apiService.deleteRequest(`review/${reviewId}`, {
      productId: productId,
    });
    if (response?.isError) {
      toast.error("Error adding new review", response?.isError);
    } else {
      fetchReview();
    }
  };

  useEffect(() => {
    if (isCartUpdated) {
      if (isBuyNowClicked) {
        navigate("/checkout-product");
        setIsBuyNowClicked(false);
        return;
      }
      // dispatch(resetCartState());
      addToCartInfoToast();
    }
  }, [isCartUpdated]);

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Product Detail"} ref={productDetailsRef} />

        <div className="shop-detail">
          <div className="card">
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-6">
                  <Slick images={images || []} />
                </div>
                <div className="col-lg-6 mt-4">
                  <div className="shop-content" style={{ marginLeft: "30px" }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      {stock > 0 ? 
                        <span className="badge text-bg-success fs-2 fw-semibold">
                          In stock 
                          </span>
                            :
                          <span className="badge text-bg-danger fs-2 fw-semibold">
                           Out of stock
                        </span>
                      }
                      {categories && (
                        <span className="fs-2">
                          <p className="mb-0">{categories}</p>
                        </span>
                      )}
                    </div>
                    <h5>{productName || ""}</h5>
                    <h6 className="fw-semibold mb-3">
                      {formatToINR(updatedPrice ? updatedPrice : basePrice)}{" "}
                      {updatedPrice && (
                        <span className="ms-2 fw-normal text-muted">
                          <del className="text-muted">
                            {formatToINR(basePrice)}
                          </del>
                        </span>
                      )}
                    </h6>
                    <div className="d-flex align-items-center gap-8 pb-4 border-bottom">
                      <RatingComponent rating={ratings} readOnly={true} />
                      <a
                        href="javascript:void(0)"
                        onClick={(e) => {
                          e.preventDefault();
                          reviewTabButtonRef?.current?.click();
                          reviewTabButtonRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        (
                        {numOfReviews > 1
                          ? `${numOfReviews} Reviews`
                          : `${numOfReviews} Review`}
                        )
                      </a>
                    </div>
                    <ColorSections colors={colors} />
                    {stock > 0 && (
                      <>
                        <QTYSection
                          quantity={quantity}
                          stock={stock}
                          handleQuantity={handleQuantity}
                          productDetail={productDetail}
                        />
                        <BuyNowSection
                          setIsBuyNowClicked={setIsBuyNowClicked}
                          handleAddToCart={handleAddToCart}
                          productDetail={productDetail}
                        />
                      </>
                    )}

                    <p className="mb-0">Dispatched in 2-3 weeks</p>
                    <a href="javascript:void(0)">
                      Why the longer time for delivery?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DescriptionReviewSection
            reviewTabButtonRef={reviewTabButtonRef}
            description={description}
            reviewList={reviewList}
            addReviewBtn={addReviewBtn}
            ratings={ratings}
            isUserReviewed={isUserReviewed}
            setReviewForm={setReviewForm}
            handleDeleteReview={handleDeleteReview}
            productId={productId}
            reviewCloseBtnRef={reviewCloseBtnRef}
          />
          <RelatedProducts productId={productId} />
        </div>
        <AddReview
          setReviewForm={setReviewForm}
          reviewForm={reviewForm}
          reviewCloseBtnRef={reviewCloseBtnRef}
          addNewReview={addNewReview}
        />
      </div>
    </>
  );
};

export default ProductDetails;
