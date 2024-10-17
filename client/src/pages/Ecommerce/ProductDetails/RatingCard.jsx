import React from "react";

const RatingCard = ({ reviews }) => {
  const cardElment = () => {
    const dynamicArray = Array.from({ length: 5 }, (_, i) => i + 1);
    return dynamicArray.map((array, index) => {
      const condition = reviews?.filter(
        (x) => x.rating > index && x.rating <= array
      )?.length;
      return (
        <>
          <div key={index} className="d-flex align-items-center gap-9 mb-3">
            <span className="flex-shrink-0 fs-2">{array} Stars</span>
            <div className="progress bg-primary-subtle w-100 h-4">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow="45"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                  width: `${condition}%`,
                }}
              ></div>
            </div>
            <h6 className="mb-0">({condition})</h6>
          </div>
        </>
      );
    });
  };
  return (
    <>
      <div className="card shadow-none border w-100 mb-7 mb-lg-0">
        <div className="card-body p-4 d-flex flex-column justify-content-center">
          {cardElment()}
        </div>
      </div>
    </>
  );
};

export default RatingCard;
