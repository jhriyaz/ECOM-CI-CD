import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header.js'
import axios from 'axios'
import { useRouter } from 'next/router'
import CampCard from '../../components/productCard/CampCard'
import { SpinnerCircularFixed } from 'spinners-react';
import { Menu, Checkbox, Pagination, Select } from 'antd';
const { Option } = Select

function Campaign() {
    let Router = useRouter()
    let slug = Router.query.slug

    const [active, setActive] = useState("categories")
    const [isLoading, setIsLoading] = useState(false)

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [campaign, setCampaign] = useState(null)

    const [options, setOptions] = useState({ key: "category", value: "", page: 0, sort_by: "newest" })

    const [total, setTotal] = useState(0)


    useEffect(() => {
        if (slug) {
            setIsLoading(true)
            axios.get(`/campaign/products/${slug}?${options.key}=${options.value}&page=${options.page}&sort_by=${options.sort_by}`)
                .then(res => {
                    setProducts(res.data.products);
                    setCampaign(res.data.campaign);
                    setCategories(res.data.categories);
                    setBrands(res.data.brands);
                    setTotal(res.data.count)
                    setIsLoading(false)

                })
                .catch(err => {
                    setIsLoading(false)
                    //console.log(err);
                })
        }
    }, [slug, options])




    return (
        <>
            <Header />
            <div id='campaign'>
                <div className="main_container">

                    <div className="wrapper">
                        <div className="action_button">
                            <button onClick={() => setActive("brands")} className={active === 'brands' ? "active" : ""}>Brands</button>
                            <button onClick={() => setActive("categories")} className={active === 'categories' ? "active" : ""}>Categories</button>
                        </div>
                        <div className="dividar"></div>
                        <div className="categories">

                            {
                                !isLoading && active === 'categories' &&
                                <div onClick={() => setOptions(prev => ({ ...prev, key: "category", value: '', page: 0 }))} className={`camp_cat_card ${options.value === '' && "active"}`}>
                                    <span>All Categories</span>
                                </div>
                            }
                            {
                                !isLoading && active === 'brands' && <div onClick={() => setOptions(prev => ({ ...prev, key: "brand", value: '', page: 0 }))} className={`camp_cat_card ${options.value === '' && "active"}`}>
                                    <span>All Brands</span>
                                </div>
                            }




                            {
                                active === 'categories' ?

                                    categories.length > 0 &&
                                    categories.map((cat, index) => (
                                        <div onClick={() => setOptions(prev => ({ ...prev, key: "category", value: cat._id, page: 0 }))} key={index} className={`camp_cat_card ${options.key === 'category' && options.value === cat._id && "active"}`}>
                                            <span>{cat.name}</span>
                                        </div>
                                    )) :
                                    active === 'brands' &&
                                    brands.length > 0 &&
                                    brands.map((brand, index) => (
                                        <div onClick={() => setOptions(prev => ({ ...prev, key: "brand", value: brand._id, page: 0 }))} key={index} className={`camp_cat_card ${options.key === 'brand' && options.value === brand._id && "active"}`}>
                                            <span>{brand.name}</span>
                                        </div>
                                    ))
                            }
                        </div>

                        <div className="dividar"></div>
                        {
                            !isLoading && <div className='header_info'>
                                <div className='total'>{total} products found</div>
                                <div className="sort">
                                    <span className='label'>Sort By</span>
                                    <Select
                                        className='sort_select'
                                        value={options.sort_by}
                                        onChange={(value) => setOptions(prev => ({ ...prev, sort_by: value }))}
                                    >
                                        <Option value="newest">Newest</Option>
                                        <Option value="oldest">Oldest</Option>
                                        <Option value="price-asc">Price: low to high</Option>
                                        <Option value="price-desc">Price: high to low</Option>
                                    </Select>
                                </div>
                            </div>
                        }
                        <div className={!isLoading && "product_list"}>
                            {
                                isLoading ?
                                    <div style={{ textAlign: "center", marginTop: "10vh" }}>
                                        <SpinnerCircularFixed style={{ margin: "0 auto" }} size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
                                    </div>
                                    :
                                    products.length > 0 && campaign ?
                                        products.map((product, index) => (
                                            <CampCard product={product} key={index} _id={campaign._id} />
                                        )) :
                                        <p>No products found</p>
                            }
                        </div>


                        {
                            !isLoading && <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0" }}>
                                <Pagination
                                    current={options.page !== 0 ? parseInt(options.page) : 1}
                                    showSizeChanger={false}
                                    onShowSizeChange={(c, limit) => syncUrlPage(limit, "limit")}
                                    pageSize={24}
                                    pageSizeOptions={[1, 2, 5]}
                                    onChange={(val) => setOptions(prev => ({ ...prev, page: val - 1 }))}
                                    total={total}

                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Campaign
