import React from 'react'
import Link from 'next/link'


function ShopByCategory({ title, data }) {
    return (
        <div className="shop_by_cat">
            <div className="section_heading">
                <h5>{title}</h5>
                <Link href="/categories">
                    <p className="primary_btn m-1" >View all</p>
                </Link>

            </div>
            <div className="shop_by_content">
                {
                    data && data.slice(0, 11).map((item, index) => {
                        return (
                            <div key={index} className="brand_cat_card">
                                <Link href={`/search?category=${item.slug}`}>
                                    <div>
                                        <img src={item.categoryImage ? item.categoryImage : "https://via.placeholder.com/200"} alt="" />
                                        <span>{item.name}</span>
                                    </div>
                                </Link>

                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default ShopByCategory
