import React from 'react'
import RatingComponent from '../../../components/Rating/RatingComponent';

const AddReview = ({
  setReviewForm,
  reviewForm,
  reviewCloseBtnRef,
  addNewReview,
}) => {
  return (
    <div
      id="review-modal"
      className="modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-dialog modal-dialog-centered">
        <div className="modal-content modal-filled">
          <div className="modal-header modal-colored-header bg-primary text-white">
            <h4 className="modal-title text-white" id="info-header-modalLabel">
              Add Review
            </h4>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="card-body">
                <div className="mb-4">
                  <RatingComponent
                    setRating={(value) => {
                      setReviewForm({
                        ...reviewForm,
                        rating: value,
                      });
                    }}
                    rating={reviewForm?.rating}
                  />
                </div>
                <div className="mb-4">
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      cols="20"
                      rows="5"
                      style={{ padding: "15px" }}
                      onChange={(e) => {
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target?.value,
                        });
                      }}
                      value={reviewForm?.comment}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            {/* <AddReview setNewCategories={setNewCategories} /> */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              ref={reviewCloseBtnRef}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addNewReview}
              disabled={!(reviewForm?.comment && reviewForm?.rating)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview