import React, { useEffect, useState } from "react";
import ReviewCard from "../../../components/ReviewCard/ReviewCard";
import apiService from "../../../service/apiService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SerchProductByIdInput from "./SerchProductByIdInput";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Loader from "../../../components/Loader/Loader";

const ReviewList = () => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [reviewList, setReviewList] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const commonClass =
    "nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3 me-0 me-md-2";
  const fetchReview = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequest(
        `review/admin/product/${productId}`
      );
      if (response.isError) {
        setIsLoading(false);
      } else {
        const { reviews } = response;
        setReviewList(reviews);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error fetching reviews", error);
      setIsLoading(false);
    }
  };

  const handleDeactive = async (reviewId,approved) => {
    const response = await apiService.deleteRequest(`review/admin/${reviewId}`, {
      productId: productId,
      approved,
    });
    if (response?.isError) {
      toast.error("Error adding new review", response?.isError);
    } else {
      fetchReview();
    }
  };

  useEffect(() => {
    if (!productId) {
      setReviewList([]);
    }
  }, [productId]);

  const handleSearchProduct = () => {
    if (!productId) {
      setReviewList([]);
      return;
    }
    if (productId?.length === 24) {
      fetchReview();
    } else {
      toast.warning("Product ID must be 24 characters length");
    }
  };

  const getReviewList = () =>{
    const filterItems = reviewList?.filter((item) => {
        return currentTab === "all"
          ? item
          : currentTab === "active"
          ? item?.approved
          : !item?.approved;
      });
  return filterItems
  }
 
  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid checkout">
        <BreadCrumb title={"Review List"} />
        <SerchProductByIdInput
          productId={productId}
          setProductId={setProductId}
          handleSearchProduct={handleSearchProduct}
        />
        {reviewList?.length > 0 && 
        <ul className="nav nav-pills p-3 mb-3 rounded align-items-center card flex-row d-flex justify-content-center">
          <li
            className="nav-item"
            onClick={(e) => {
              setCurrentTab("all");
            }}
          >
            <button
              style={{ fontSize: "15px" }}
              className={`btn btn-primary ${commonClass} ${
                currentTab === "all" ? "active" : ""
              }`}
              id="all-tab"
            >
              <i className="ti ti-list fill-white"></i>
              <span className="d-none d-md-block fw-medium">All Reviews</span>
            </button>
          </li>
          <li
            className="nav-item"
            onClick={(e) => {
              setCurrentTab("active");
            }}
          >
            <button
              style={{ fontSize: "15px" }}
              className={`btn btn-primary ${commonClass} ${
                currentTab === "active" ? "active" : ""
              }`}
              id="active-tab"
            >
              <i className="ti ti-check fill-white"></i>
              <span className="d-none d-md-block fw-medium">
                Active Reviews
              </span>
            </button>
          </li>
          <li
            className="nav-item"
            onClick={(e) => {
              setCurrentTab("de-active");
            }}
          >
            <button
              style={{ fontSize: "15px" }}
              className={`btn btn-primary ${commonClass} ${
                currentTab === "de-active" ? "active" : ""
              }`}
              id="deactive-tab"
            >
              <i className="ti ti-x fill-white"></i>
              <span className="d-none d-md-block fw-medium">
                Deactive Reviews
              </span>
            </button>
          </li>
        </ul>
        }
        <ReviewCard
          reviews={getReviewList()}
          userId={user?._id}
          isAdmin={isAdmin}
          handleDeactive={handleDeactive}
        />
      </div>
    </>
  );
};

export default ReviewList;
