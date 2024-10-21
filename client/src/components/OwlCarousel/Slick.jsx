import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/ slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-style.css";

const Slick = ({ images }) => {
 const mainSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
   arrows: true,
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

 const onMouseMove = (e) => {
  const target = e.currentTarget ;
  const x = (e.nativeEvent.offsetX / target.offsetWidth) * 100;
  const y = (e.nativeEvent.offsetY / target.offsetHeight) * 100;
  target.style.backgroundPosition = x + "% " + y + "%";
  target.style.cursor = 'zoom-in';
};

const onMouseEnter = (e) => {
  const target = e.currentTarget;
  const zoom = target.getAttribute("data-zoom");
  const $img = target.querySelector("img");
  $img.style.pointer = 'zoom-in';
  if ($img) {
    ($img.nextSibling).style.display = "block";
  }

  if (zoom) {
    const temp = new Image();
    temp.src = zoom;
    temp.onload = () => {
      target.style.backgroundImage = `url(${zoom})`;
      target.style.pointer = 'zoom-in';
      if ($img) {
        $img.style.opacity = "0";
        ($img.nextSibling).style.display = "none";
      }
    };
  }
};

const onMouseLeave = (e) => {
  const target = e.currentTarget;
  const $img = target.querySelector("img");
  target.removeAttribute("style");
  if ($img) {
    $img.style.opacity = "1";
    ($img.nextSibling).style.display = "none";
  }
};

  return (
    <div className="slick-carousel-container">
      <Slider className="owl-product-img" {...mainSliderSettings} ref={mainSliderRef}>
        {images?.map((image, index) => (
          <>
            <div className="images-div"
               onMouseMove={onMouseMove}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
               data-zoom={image?.url} 
               style={{cursor: 'zoom-in'}}
               key={index}>
              <img 
                style={{cursor: 'zoom-in'}}
                src={image?.url}
                alt={`Thumbnail-${index}`}
                className="img-fluid"
              />
              <div className="zoom__loading" />
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
