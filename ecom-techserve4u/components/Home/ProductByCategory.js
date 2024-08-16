import React, { useState, useEffect } from 'react'
import ProductCard from '../productCard'
import axios from 'axios'
import Link from 'next/link'
import { SpinnerCircularFixed } from 'spinners-react';
function ProductByCategory({ category, setLoadingProd }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (category) {
            setLoading(true)
            axios.get(`/product/productbycat/${category.slug}`)
                .then(res => {
                    setProducts(res.data.products)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }

    }, [category])
    const prod = () => (
        <div className="shop_by">
            <div className="section_heading">
                <h5>{category?.name}</h5>
                <Link href={`/search?category=${category?.slug}`}>
                    <p className="primary_btn m-1">View all</p>
                </Link>

            </div>
            <div className="shop_by_content">
                {
                    products.length > 0 ? products.map((item, index) => {
                        return (
                            <ProductCard product={item} key={index} />
                        )
                    }) :
                        <p>No products found</p>
                }

            </div>
        </div>
    )
    return (
        loading ?
            <>
                <div key={0} style={{ textAlign: "center", margin: "10px auto", marginBottom: "400px" }}>
                    <SpinnerCircularFixed size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
                </div>
            </>
            : prod()
    )
}

export default ProductByCategory
