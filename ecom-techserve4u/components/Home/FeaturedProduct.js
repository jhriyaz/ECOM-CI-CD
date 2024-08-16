import React from 'react'
import Slider from "react-slick";
import ProductCard from '../productCard'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 2,
  autoplay: true,
  speed: 3000,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1370,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2,
        infinite: true,
      }
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: true,
      }
    },
    {
      breakpoint: 840,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
      }
    },
    {
      breakpoint: 560,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
      }
    },
  ]
  // nextArrow: <div className="next">next</div>,
  // prevArrow: <div className="prev">dgdsfgh</div>

};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

function FeaturedProduct({ title, products }) {
  return (
    <div className="featured_product">
      <div className="section_heading">
        <h5>{title}</h5>
      </div>
      <div className="section_content">
        <Slider {...settings}>
                    {
                        products.map((product, index) => {
                            return (
                               <ProductCard product={product} key={index} />
                            )
                        })
                    }
                </Slider>
        {/* <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={ true }
          autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          //removeArrowOnDeviceType={["tablet", "mobile"]}
          //deviceType={'mobile'}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {products.map((product, index) => {
            return <ProductCard product={product} key={index} />;
          })}
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div> 
        </Carousel> */}
      </div>
    </div>
  );
}

export default FeaturedProduct
