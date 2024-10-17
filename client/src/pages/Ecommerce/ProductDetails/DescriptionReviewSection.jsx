import React from 'react'
import RatingCard from './RatingCard';
import RatingComponent from '../../../components/Rating/RatingComponent';
import { useNavigate } from 'react-router-dom';
import ReviewCard from '../../../components/ReviewCard/ReviewCard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const DescriptionReviewSection = ({
  reviewTabButtonRef,
  description,
  reviewList,
  addReviewBtn,
  ratings,
  isUserReviewed,
  setReviewForm,
  handleDeleteReview,
  productId,
  reviewCloseBtnRef,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, loginUserData: user } = useSelector(
    (state) => state.auth
  );
  return (
    <div className="card">
      <div className="card-body p-4">
        <ul
          className="nav nav-pills user-profile-tab border-bottom"
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6"
              id="pills-description-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-description"
              type="button"
              role="tab"
              aria-controls="pills-description"
              aria-selected="true"
            >
              Description
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6"
              id="pills-reviews-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-reviews"
              type="button"
              role="tab"
              aria-controls="pills-reviews"
              aria-selected="false"
              ref={reviewTabButtonRef}
            >
              Reviews
            </button>
          </li>
        </ul>
        <div className="tab-content pt-4" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-description"
            role="tabpanel"
            aria-labelledby="pills-description-tab"
            tabIndex="0"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
          <div
            className="tab-pane fade"
            id="pills-reviews"
            role="tabpanel"
            aria-labelledby="pills-reviews-tab"
            tabIndex="0"
          >
            <div className="row">
              <div className="col-lg-4 d-flex align-items-stretch">
                <div className="card shadow-none border w-100 mb-7 mb-lg-0">
                  <div className="card-body text-center p-4 d-flex flex-column justify-content-center">
                    <h6 className="mb-3">Average Rating</h6>
                    <h2 className="text-primary mb-3 fw-semibold fs-9">
                      {ratings || 0}/5
                    </h2>
                    <div className="text-center d-flex justify-content-center">
                      <RatingComponent rating={ratings} readOnly={true} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-stretch">
                <RatingCard reviews={reviewList} />
              </div>
              <div className="col-lg-4 d-flex align-items-stretch">
                <div className="card shadow-none border w-100 mb-7 mb-lg-0">
                  <div className="card-body p-4 d-flex flex-column justify-content-center">
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center gap-2 mx-auto"
                      data-bs-toggle="modal"
                      data-bs-target={isLoggedIn ? "#review-modal" : ""}
                      ref={addReviewBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                          toast.warn('You must be logged in to process further');
                          navigate("/auth/login");
                          return;
                        }
                        // const reviewModal =
                        if (isUserReviewed[0]) {
                          const { rating, comment } = isUserReviewed[0];
                          setReviewForm({
                            rating: rating,
                            comment: comment,
                            productId: productId,
                            userId: user?._id,
                          });
                        }
                      }}
                    >
                      <i className="ti ti-pencil fs-7"></i>
                      {isUserReviewed?.length > 0 ? "Edit" : "Write"} an Review
                    </button>
                  </div>
                </div>
              </div>
              {reviewList && reviewList?.length > 0 && (
                <div className="col-lg-12 d-flex align-items-center justify-content-center mt-4">
                  <ReviewCard
                    reviews={reviewList}
                    userId={user?._id}
                    deleteReview={handleDeleteReview}
                    editReview={(review) => {
                      setReviewForm({
                        rating: review.rating,
                        comment: review.comment,
                        productId: productId,
                        userId: user?._id,
                      });
                      addReviewBtn.current.click();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionReviewSection