import React, { useEffect, useState } from 'react'
import SliderComp from '../components/Home/Slider.js'
import Header from '../components/header/Header.js'
import FeaturedProduct from '../components/Home/FeaturedProduct.js'
import ShopByCategory from '../components/Home/ShopByCategory.js'
import ShopByBrand from '../components/Home/ShopByBrand.js'
import ProductByCategory from '../components/Home/ProductByCategory.js'
import CatList from '../components/categorieslist/index.js'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller';
import LatestProducts from '../components/Home/LatestProducts.js'
import { useSelector } from 'react-redux'
import { NextSeo } from 'next-seo';


export default function Home() {
  const { categories, brands } = useSelector(state => state.general)
  const [latestProducts, setLatestProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])





  const fetchLatestProduct = () => {
    axios.get('/product/getProducts')
      .then(res => {
        if (res.data.success) {
          setLatestProducts(res.data.products)

        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  const fetchFeatured = () => {
    axios.get('/product/getFeatured')
      .then(res => {
        if (res.data.success) {
          setFeaturedProducts(res.data.products)
        }
      })
      .catch(err => {
        console.log(err);
      })
  }



  useEffect(() => {
    fetchLatestProduct()
    fetchFeatured()
  }, [])

  const [currentCatIndex, setCurrentCatIndex] = useState(0)
  const [cats, setCats] = useState([])
  const [hasmore, setHasmore] = useState(true)
  const [loadingProd, setLoadingProd] = useState(true)


  const loadCatProd = () => {
    console.log(currentCatIndex);
    if (categories.length < 1) return
    //if(loadingProd)return
    if (currentCatIndex >= categories.length) {
      return setHasmore(false)
    } else {
      setCats(prev => [...prev, categories[currentCatIndex]])

      setCurrentCatIndex(prev => prev + 1)

    }

  }

  return (
    <>
      <Header />
      <div id="home">

        <NextSeo
          title="Ecommerce Website"
          description="This is react js ecommerce website"
          canonical="https://test-ecom.techserve4u.com/"
          openGraph={{
            url: 'https://test-ecom.techserve4u.com/',
            title: 'Ecommerce Website',
            description: 'This is react js ecommerce website',
            images: [
              {
                url: 'https://acquire.io/wp-content/uploads/2017/12/7-Ecommerce-Technology-Trends-that-Empower-Businesses-Updated.png',
                width: 800,
                height: 600,
                alt: 'Og Image Alt',
              },
            ],
            site_name: 'Techserve4u',
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />


        <div className="main_container">
          <div className="row hero">
            <div className="col-lg-3 cat_list_wrap">
              <CatList categories={categories} />
            </div>
            <div className="col-lg-9 col-md-12">

              <div className='slider_container'>
                <SliderComp />
                <div className="site_info_policy">
                  <div className="info_item">
                    <div className="icon"><i className="fas fa-rocket"></i></div>
                    <div className='text'>
                      <span>Free shipping</span>
                      <span>From $99.00</span>
                    </div>
                  </div>
                  <div className="info_item">
                    <div className="icon"><i className="fas fa-hand-holding-usd"></i></div>
                    <div className='text'>
                      <span>Money Guarantee</span>
                      <span>30 days back</span>
                    </div>
                  </div>
                  <div className="info_item">
                    <div className="icon"><i className="fas fa-umbrella"></i></div>
                    <div className='text'>
                      <span>100% Safe</span>
                      <span>Secure shopping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <section className="featured">
            <FeaturedProduct title="Featured Products" products={featuredProducts} />
          </section>
          <section className="my-3">
            {latestProducts.length > 0 && <LatestProducts array={latestProducts} title="Latest products" hidetitle={false} />}

          </section>
          <section className="my-3">
            <ShopByBrand title="Shop by brand" data={brands} />
          </section>
          <section className="my-3">
            <ShopByCategory title="Shop by Category" data={categories} />
          </section>





          <InfiniteScroll
            pageStart={currentCatIndex}
            loadMore={() => loadCatProd()}
            hasMore={hasmore}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            {
              cats.length > 0 && cats.map((cat, index) => {
                return (
                  <section key={index} className="my-3">
                    <ProductByCategory setLoadingProd={setLoadingProd} category={cat} />
                  </section>
                )
              })
            }

          </InfiniteScroll>


        </div>
      </div>




    </>
  )
}
