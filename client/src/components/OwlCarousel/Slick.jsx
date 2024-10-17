import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/ slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-style.css";

const Slick = ({ images }) => {
 const mainSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  console.log("activeIndex", activeIndex);
 const mainSliderSettings = {
   dots: false,
   infinite: true,
   speed: 500,
   slidesToShow: 1,
   slidesToScroll: 1,
   asNavFor: thumbnailSliderRef.current,
   arrows: false,
   beforeChange: (current, next) => setActiveIndex(next), // Update active index
 };

 const thumbnailSliderSettings = {
   dots: false,
   infinite: true,
   speed: 500,
   slidesToShow: images?.length > 3 ? 5 : 3,
   slidesToScroll: 3,
   arrows: false,
   centerMode: true,
   centerPadding: "40px",
   asNavFor: mainSliderRef.current,
   focusOnSelect: true,
   responsive: [
     {
       breakpoint: 768,
       settings: {
         slidesToShow: images?.length > 3 ? 4 : 3,
         centerPadding: "20px",
       },
     },
     {
       breakpoint: 480,
       settings: {
         slidesToShow: images?.length,
         centerPadding: "10px",
       },
     },
     {
       breakpoint: 400, // Additional breakpoint for smaller screens
       settings: {
         slidesToShow: images?.length,
         centerPadding: "0px", // Adjust padding for very small screens
       },
     },
   ],
 };


  return (
    <div className="slick-carousel-container">
      <Slider className="owl-product-img" {...mainSliderSettings} ref={mainSliderRef}>
        {images?.map((image, index) => (
          <>
            <div className="images-div" key={index}>
              <img
                src={image?.url}
                alt={`Thumbnail-${index}`}
                className="img-fluid"
              />
            </div>
          </>
        ))}
      </Slider>

      <Slider
        className="img-thumbnail"
        {...thumbnailSliderSettings}
        ref={thumbnailSliderRef}
      >
        {images?.map((image, index) => (
          <>
            <div
              key={index}
              className={`thumbnail ${activeIndex === index ? "active" : ""}`}
            >
              <img
                src={image?.url}
                alt={`Thumbnail-${index}`}
                className="img-fluid"
              />
            </div>
          </>
        ))}
      </Slider>
    </div>
  );
};

export default Slick;
