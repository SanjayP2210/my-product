import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
// import "../../assets/libs/owl.carousel/dist/assets/owl.carousel.min.css";
import "./index.css";
// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";

const OwlCarouselComponent = ({ images = [] }) => {

  const [currentImage, setCurrentImage] = useState();

  useEffect(() => {
    if (images?.length > 0) {
      setCurrentImage(images[0]);
    }
    setTimeout(() => {
      const thumb = document.querySelectorAll(".thumbnail-carousel .owl-item");
      if (thumb) {
        for (const element of thumb) {
          console.log("element", element);
          element.classList.remove("active");
        }
        thumb?.[0]?.classList?.add("active");
      }
    }, 1000);

    // eslint-disable-next-line no-undef
    var owl = $('.owl-carousel');
    // $('.owl-carousel').owlCarousel({
    //   onDragged: callback
    // });
    owl.owlCarousel({
        onDragged: callback
    });
    function callback(event) {
      console.log("event", event);
    }
  }, [images]);

  const [sync1, setSync1] = useState(null);
  const [sync2, setSync2] = useState(null);
   const handleDrag = (event) => {
     const { item } = event;
     //  setActiveIndex(item.index);
     console.log("index", item.index);
   };


  const options1 = {
    items: 1,
    nav: false,
    autoplay: false,
    dots: true,
    loop: true,
    responsiveRefreshRate: 200,
    navText: [
      '<svg width="12" height="12" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 3px;stroke: #fff;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>',
      '<svg width="12" height="12" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 3px;stroke: #fff;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>',
    ],
  };

  const options2 = {
    items: 4,
    margin: 16,
    dots: true,
    nav: false,
    smartSpeed: 200,
    slideBy: 4,
    responsiveRefreshRate: 100,
  };

  const handleSync1Change = (event) => {
    const { count, index } = event.item;
    const currentIndex = Math.round(index - count / 2 - 0.5);
    const newIndex =
      currentIndex < 0 ? count - 1 : currentIndex >= count ? 0 : currentIndex;

    sync2?.to(newIndex, 100, true);
  };

  const handleSync2Change = (event) => {
    const { index } = event.item;
    sync1?.to(index, 100, true);
  };

  const handleImageClick = (e, index) => {
    console.log('e', e, index)
    const thumb = document.querySelectorAll(".thumbnail-carousel .owl-item");
    if (thumb) {
      for (const element of thumb) {
        // console.log("element", element);
        element.classList.remove("active");
      }
      // thumb[index].classList.add("active");
    }
  };

  const handleThumbnailClick = (e, index) => {
    const thumb = document.querySelectorAll(".thumbnail-carousel .owl-item");
    for (const element of thumb) {
      console.log('element', element);
      element.classList.remove('active');
    }
    thumb[index].classList.add('active');
    e.target.classList.add('active');
    sync1?.to(index, 300, true);
  };

  return (
    <>
      <OwlCarousel
        id="sync1"
        // ref={(carousel) => setSync1(carousel)}
        // events={{
        //   onChanged: handleSync1Change,
        // }}
        onDragged={handleDrag}
        data-slide-speed="2000"
        rtl={"true"}
        className="owl-carousel owl-theme product-img"
        {...options1}
      >
        {images?.map((image, index) => (
          <div
            key={index}
            className="images-div item rounded overflow-hidden"
            onClick={(e) => handleImageClick(e, index)}
          >
            <img
              src={image?.url}
              alt={`Image ${index}`}
              className="img-fluid"
            />
          </div>
        ))}
      </OwlCarousel>

      <OwlCarousel
        id="sync2"
        className="thumbnail-carousel"
        ref={(carousel) => setSync2(carousel)}
        data-slide-speed="500"
        rtl={"true"}
        options={options2}
        events={{
          onChanged: handleSync2Change,
        }}
      >
        {images?.map((image, index) => (
          <div
            key={index}
            className="thumbnail-div item rounded overflow-hidden"
            onClick={(e) => handleThumbnailClick(e, index)}
          >
            <img
              src={image?.url}
              alt={`Thumbnail ${index}`}
              className="img-fluid"
            />
          </div>
        ))}
      </OwlCarousel>
    </>
  );
};

export default OwlCarouselComponent;
