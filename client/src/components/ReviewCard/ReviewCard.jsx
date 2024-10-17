import React from "react";
import profilePng from "../../assets/images/profile/user-1.jpg";
import RatingComponent from "../Rating/RatingComponent";
import "./index.css";
import { formatDate } from "../../constants/utilities";
import { useSelector } from "react-redux";

const ReviewCard = ({
  reviews,
  deleteReview,
  userId,
  editReview,
  isAdmin = false,
  handleDeactive,
}) => {
  const isAnyReviewFound = reviews.some(
    (review) => review.userDetails?._id === userId
  );

  const getAdminActionButtons = (_id, approved) => {
    return (
      <>
        <td>
          <a
            className="fs-6 text-muted"
            href="javascript:void(0)"
            style={{ marginLeft: "20px" }}
            onClick={() => {
              handleDeactive(_id, !approved);
            }}
          >
            {approved ? (
              <i style={{ color: "red" }} className="ti ti-x"></i>
            ) : (
              <i style={{ color: "green" }} className="ti ti-check"></i>
            )}
          </a>
        </td>
      </>
    );
  };

  const getUserActionButtons = (_id, review) => {
    return (
      <td>
        <a
          className="fs-6"
          href="javascript:void(0)"
          style={{ marginLeft: "20px" }}
          onClick={() => {
            editReview(review);
          }}
        >
          <i className="ti ti-edit"></i>
        </a>
        <a
          className="fs-6"
          href="javascript:void(0)"
          style={{ marginLeft: "20px" }}
          onClick={() => {
            deleteReview(_id);
          }}
        >
          <i className="ti ti-trash"></i>
        </a>
      </td>
    );
  };
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-7">Customer Reviews</h4>
          <div className="table-responsive mb-4 rounded-1">
            <table className="table mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  {isAdmin && (
                    <th>
                      <h6 className="fs-3 fw-semibold mb-0">Review ID</h6>
                    </th>
                  )}
                  <th>
                    <h6 className="fs-3 fw-semibold mb-0">Customer</h6>
                  </th>
                  <th>
                    <h6 className="fs-3 fw-semibold mb-0">Rating</h6>
                  </th>
                  <th>
                    <h6 className="fs-3 fw-semibold mb-0">Comment</h6>
                  </th>
                  <th>
                    <h6 className="fs-3 fw-semibold mb-0">Date</h6>
                  </th>
                  {(isAnyReviewFound ||
                    isAdmin) && (
                      <th>
                        <h6 className="fs-3 fw-semibold mb-0 text-end">
                          Actions
                        </h6>
                      </th>
                    )}
                </tr>
              </thead>
              <tbody>
                {reviews &&
                  reviews?.map((review, index) => {
                    const { userDetails, comment, modifiedAt, approved, _id } =
                      review;
                    const { name } = userDetails || "";
                    return (
                      <>
                        <tr key={_id}>
                          {isAdmin && (
                            <td>
                              <h6 className="fs-4 fw-semibold mb-0 text-nowrap">
                                #{_id}
                              </h6>
                            </td>
                          )}
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={userDetails?.image?.url || profilePng}
                                className="rounded-circle"
                                width="30"
                                height="30"
                              />
                              <div className="ms-3">
                                <h6 className="fs-4 fw-semibold mb-0 text-nowrap">
                                  {userId === userDetails?._id ? "You" : name}
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td style={{ minWidth: "200px" }}>
                            <RatingComponent
                              rating={review.rating}
                              readOnly={true}
                            />
                          </td>
                          <td>
                            <span className="mb-0 fw-normal fs-3 mt-2">
                              {comment}
                            </span>
                          </td>
                          <td>
                            <p className="mb-0 fw-normal fs-3 text-end text-nowrap">
                              {formatDate(modifiedAt)}
                            </p>
                          </td>
                          {!isAdmin && isAnyReviewFound && (review.userDetails?._id === userId) &&
                            getUserActionButtons(_id, review)}
                          {isAdmin && getAdminActionButtons(_id, approved)}
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
