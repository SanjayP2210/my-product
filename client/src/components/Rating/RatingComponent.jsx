import React, { useEffect, useRef, useState } from "react";
import ReactStars from "react-stars";

const RatingComponent = ({ rating, setRating, readOnly, size }) => {
  // const [rating, setRating] = useState(0);
  const ratingRef = useRef();

  const ratingChanged = (value) => {
    setRating(value);
  };

  useEffect(() => {
    if (ratingRef?.current) {
      console.log("ratingRef", ratingRef);
    }
  }, [ratingRef.current]);

  return (
    <>
      <ReactStars
        count={5}
        value={rating}
        onChange={ratingChanged}
        size={size || 30}
        color2={"#ffd700"}
        color1={"gray"}
        ref={ratingRef}
        half={true}
        edit={!readOnly}
        char={"★"}
        style={{minWidth: '90px'}}
      />
    </>
  );
};

export default RatingComponent;
