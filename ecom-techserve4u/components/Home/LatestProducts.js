import React, { useState, useEffect } from 'react'
import ProductCard from '../productCard'
import Link from 'next/link'

function LatestProducts({ array, title, hidetitle }) {

    return (
        <div className="shop_by">


            <div className="section_heading">
                <h5>{title}</h5>
                {
                    !hidetitle &&
                    <Link href="/search">
                        <p className="primary_btn m-1">View all</p>
                    </Link>
                }
            </div>


            <div className="shop_by_content">
                {
                    array.length > 0 ? array.map((item, index) => {
                        return (
                            <ProductCard product={item} key={index} />
                        )
                    }) :
                        <p>No products found</p>
                }

            </div>
        </div>
    )
}

export default LatestProducts
