import React from 'react'
import Header from '../components/header/Header.js'
import { useSelector } from 'react-redux'
import { Card } from 'antd'
import Link from 'next/link'
function brands() {
    const { brands } = useSelector(state => state.general)
    return (
        <>
            <Header />
            <div id="brands_page">
                <div className="main_container">
                    <Card style={{ marginTop: "20px" }} title={<h3>Brands</h3>}>
                        <div className="shop_by">
                            <div className="shop_by_content">
                                {
                                    brands && brands.map((item, index) => {
                                        return (
                                            <div key={index} className="brand_cat_card">
                                                <Link href={`/search?brand=${item.slug}`}>
                                                    <div>
                                                        <img src={item.image ? item.image : "https://via.placeholder.com/200"} alt="" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </Link>

                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default brands
