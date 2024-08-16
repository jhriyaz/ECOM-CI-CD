import React, { useState, useEffect } from 'react'
import Header from '../../components/header/Header'

import axios from 'axios'
import { Empty } from 'antd';

import { NextSeo } from 'next-seo';
import ProductInfo from '../../components/product-details/productDetails';
import SideInfo from '../../components/product-details/SideInfo';
import RelatedProducts from '../../components/product-details/RelatedProducts';
import LatestProducts from '../../components/Home/LatestProducts'



function ProductDeatils({ product, campDiscount }) {

    const [relatedProducts, setRelatedProducts] = useState([])

    useEffect(() => {
        if (!product?.categories) return
        let data = { _id: product._id }
        // if (product.tags?.length > 0) {
        //     data["tags"] = product.tags
        // }

        let cat2 = product.categories.filter(cat => cat.level === 2)[0]
        let cat1 = product.categories.filter(cat => cat.level === 1)[0]

        if (cat2) {
            data["category"] = cat2?.category
        } else {
            data["category"] = cat1?.category
        }


        //console.log(data);

        if (data.category) {
            axios.post('/product/getRelated', data)
                .then(res => {
                    setRelatedProducts(res.data.products);
                })
        }
    }, [product])




    return (
        <>
            <Header />
            <div id="product_details">
                {
                    product && <NextSeo
                        title={product.meta?.title || product.name}
                        description={product.meta.description || product.description}
                        canonical="https://test-ecom.techserve4u.com/"
                        openGraph={{
                            url: 'https://test-ecom.techserve4u.com/',
                            title: product.name,
                            description: 'This is react js ecommerce website',
                            images: [
                                {
                                    url:product.meta.image || product.thumbnail,
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
                }

                <div className="main_container">
                    <div className="row mt-2">

                        {
                            product ? <ProductInfo product={product} campDiscount={campDiscount} /> :
                                <div className="col-md-9 col-sm-12 mt-5">
                                    <Empty description={"No product found"} />
                                </div>
                        }

                        <div className="col-md-3 col-sm-12 right_side">
                            <SideInfo />
                        </div>
                        <section className="my-2">
                         
                                <LatestProducts hidetitle={true} title="Related products" array={relatedProducts} />
    
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

ProductDeatils.getInitialProps = async (ctx) => {
    //console.log(ctx.query);
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/details/${ctx.query.slug}?campaign=${ctx.query.campaign}`)
        //console.log(res.data.campDiscount);
        //console.log( res.data.product);
        return {
            product: res.data.product,
            campDiscount: res.data.campDiscount && res.data.campDiscount != null ? res.data.campDiscount : null// will be passed to the page component as props
        }
    } catch (error) {
        //console.log(error);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}

export default ProductDeatils
