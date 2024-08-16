import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import axios from 'axios'
import {Carousel} from 'react-bootstrap'

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 3000,
  autoplaySpeed: 2000,
  arrows: false,
  adaptiveHeight: true,


};


function SliderComp() {
  const [sliders, setSliders] = useState([])

  useEffect(() => {
    axios.get("/settings/getsliders")
      .then(res => {
        setSliders(res.data.sliders)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div className="home_slider">
      {/* <Slider {...settings}>
        {
          sliders.length > 0 ?
            sliders.map(slide => (
              <div>

                <img className="slider_img" src={slide.image} alt="" />
              </div>
            )) :
            <div>

              <img className="slider_img img-fluid" src="https://via.placeholder.com/908x320" alt="" />
            </div>
        }


      </Slider> */}


      <Carousel>


        {
          sliders.length > 0 ?
            sliders.map((slide,index) => (

    
                <Carousel.Item >
                  <img
                    style={{maxHeight:"350px",height:"100%" ,objectFit:"cover"}}
                    className="d-block w-100"
                    src={slide.image}
                    alt={slide?.title}
                  />
                </Carousel.Item>

            )) :
            <Carousel.Item >
                  <img
                    style={{maxHeight:"300px",height:"100%"}}
                    className="d-block w-100"
                    src="https://via.placeholder.com/908x320"
                    alt=""
                  />
                </Carousel.Item>
        }



        {/* <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=First slide&bg=373940"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Second slide&bg=282c34"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Third slide&bg=20232a"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item> */}
      </Carousel>
    </div>

  )
}

export default SliderComp
