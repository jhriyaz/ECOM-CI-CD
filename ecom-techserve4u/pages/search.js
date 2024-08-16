import React, { useEffect, useState, useRef } from 'react'
import Header from '../components/header/Header.js'
import { useRouter } from 'next/router'
import axios from 'axios'
import ProductCard from '../components/productCard/index.js'
import { SpinnerCircularFixed } from 'spinners-react';
import { Menu, Checkbox, Pagination, Select, Input } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import Drawer from '@material-ui/core/Drawer';
const { SubMenu } = Menu;
import Link from 'next/link'
const { Option } = Select







function search() {
    const Router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const [products, setProducts] = useState([])
    const [productsToShow, setProductsToShow] = useState([])
    const [categories, setCategories] = useState([])
    const [flatCategories, setFlatCategories] = useState([])

    const [categoriesFiltered, setCategoriesFiltered] = useState([])
    const [categoriesToShow, setCategoriesToShow] = useState([])
    const [selectedSlugPath, setSelectedSlugPath] = useState([])
    const [brandsFiltered, setBrandsFiltered] = useState([])
    const [brandsToShow, setBrandsToShow] = useState([])
    const [variationsToShow, setVariationsToShow] = useState({})

    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null)
    
    const maxRef = useRef(null)
    const minRef = useRef(null)


    const [total, setTotal] = useState(0)


    const reset = () => {
        setCategoriesFiltered([])
        setCategoriesToShow([])
        setBrandsFiltered([])
        setBrandsToShow([])
        //setPriceRange({min:0,max:0})
    }

    const fetchProducts = (options) => {
        setIsLoading(true)

        console.log('options', options);

        axios.post('/product/filter', options)
            .then(res => {
                console.log('data', res.data);
                reset()
                setProducts(res.data.products);
                setProductsToShow(res.data.products);
                setBrandsToShow(res.data.brands)
                setCategoriesToShow(res.data.categories)
                setVariationsToShow(res.data.variations)
                setTotal(res.data.count)
                setIsLoading(false)
            }).catch(err => {
                setIsLoading(false)
                //console.log(err);
            })
    }




    useEffect(() => {
        fetchProducts(Router.query)
        setOpen(false)
    }, [Router])
    Object.keys(variationsToShow).map((key, index) => {
        //console.log(key, variationsToShow[key]);
    })



    const syncUrl = (checked, val, type) => {
        // console.log(checked,key,type);
        let query = Router.query
        delete query["page"]
        //console.log(Object.keys(query).includes(type));

        if (Object.keys(Router.query).includes(type)) {
            if (checked) {
                query[type] = val
                Router.push({
                    pathname: '/search',
                    query: query,
                })
            } else {
                delete query[type];
                Router.push({
                    pathname: '/search',
                    query: query,
                })
            }


        } else {
            query[type] = val
            Router.push({
                pathname: '/search',
                query: query,
            })
        }


    }



    const syncUrlPage = (val, type) => {
        let query = Router.query


        query[type] = val
        Router.push({
            pathname: '/search',
            query: query,
        })


    }

    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(false)
    };

    const handleCloseDrawer = () => {
        setOpen(false)
    }
    
    console.log('min', min);
    console.log('max', max);
    console.log('minmax', minRef?.input?.value, maxRef?.input?.value);


    const FilterList = () => {
        return (
            <>
                <div className="filtersection">
                    <div className="filtertitle">
                        Price
                    </div>
                    <div className="filtercontent">
                        <div className="filterprice">
                            <div className="d-flex align-items-center justify-content-between">
                                {/* <Input ref={minRef} name='min' type="number" step="1" placeholder="Min price" className="priceinput" /> */}
                                <Input className="priceinput" placeholder="Min price" type="text" onChange={e => setMin(e.target.value)} value={min} />
                                <span className="mx-2"> to </span>
                                <Input className="priceinput" value={max} placeholder="Max price" type="number" step="1" onChange={(e) => setMax(e.target.value)}></Input>
                                {/* <Input ref={maxRef} name='max' type="number" step="1" placeholder="Max price" className="priceinput" /> */}
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    // {
                                    //     (minRef.current.state.value && maxRef.current.state.value) && Router.push(`/search?min=${minRef.current.state.value || 0}&max=${maxRef.current.state.value || 0}`)
                                    // }
                                    {
                                        (min && max && Router.push(`/search?min=${min || 0}&max=${max || 0}`))
                                    }

                                }} className="primary_btn">GO</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="filtersection">
                    <div className="filtertitle">
                        Category
                    </div>
                    <div className="filtercontent">

                        {
                            categoriesToShow.length > 0 && categoriesToShow.map(cat => {
                                return (
                                    <div key={cat._id}>
                                        <Checkbox checked={Router.query['category'] === cat.slug} key={cat._id} onChange={(e) => syncUrl(e.target.checked, cat.slug, 'category')}>{cat.name}</Checkbox>
                                    </div>
                                )
                            })
                        }
                        {/* {
                            categoriesToShow.length > 0 ? <Menu
                                style={{ width: 256 }}
                                selectedKeys={selectedSlugPath && selectedSlugPath}
                                defaultOpenKeys={selectedSlugPath && selectedSlugPath}
                                //openKeys={selectedSlugPath && selectedSlugPath}
                                mode="inline"


                            >
                                {
                                    categoriesToShow.length > 0 && categoriesToShow.map((cat, index) => {
                                        return (
                                            <>

                                                {
                                                    cat?.children.length > 0 ?
                                                        <SubMenu onTitleClick={(e) => Router.push(`/search?category=${e.key}`)} key={cat.slug} icon={<AppstoreOutlined />} title={cat?.name}>
                                                            {
                                                                cat.children.map(cat2 => {
                                                                    return (
                                                                        <>
                                                                            {
                                                                                cat2?.children.length > 0 ?
                                                                                    <SubMenu onTitleClick={(e) => Router.push(`/search?category=${e.key}`)} key={cat2.slug} title={cat2.name}>
                                                                                        {
                                                                                            cat2.children.map(cat3 => {
                                                                                                return (
                                                                                                    <Menu.Item key={cat3.slug}>
                                                                                                        <Link href={`/search?category=${cat3.slug}`}>
                                                                                                            <a>{cat3.name}</a>
                                                                                                        </Link>
                                                                                                    </Menu.Item>

                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </SubMenu> :
                                                                                    <Menu.Item >
                                                                                        <Link href={`/search?category=${cat2.slug}`}>
                                                                                            <a>{cat2.name}</a>
                                                                                        </Link>

                                                                                    </Menu.Item>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </SubMenu> :
                                                        <Menu.Item>{cat.name}</Menu.Item>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </Menu> :
                                <Menu>
                                    <Menu.Item icon={<AppstoreOutlined />} >
                                        <Link href={`/search`}>
                                            <a>All Categories</a>
                                        </Link>

                                    </Menu.Item>
                                </Menu>

                        } */}


                    </div>
                </div>



                <div className="filtersection">
                    <div className="filtertitle">
                        Brands
                    </div>
                    <div className="filtercontent">
                        {
                            brandsToShow.length > 0 && brandsToShow.map(brand => {
                                return (
                                    <div key={brand._id}>
                                        <Checkbox checked={Router.query['brand'] === brand.slug} key={brand._id} onChange={(e) => syncUrl(e.target.checked, brand.slug, 'brand')}>{brand.name}</Checkbox>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>


                {
                    Object.keys(variationsToShow).length > 0 && Object.keys(variationsToShow).map((key, index) => (
                        <div key={index} className="filtersection">
                            <div className="filtertitle text-capitalize">
                                {key}
                            </div>
                            <div className="filtercontent">
                                {
                                    variationsToShow[key].length > 0 && variationsToShow[key].map(vars => {
                                        return (
                                            <div key={vars}>
                                                <Checkbox checked={Router.query[key] === vars} key={vars} onChange={(e) => syncUrl(e.target.checked, vars, key)}>{vars}</Checkbox>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    ))
                }
            </>
        )
    }



    return (
        <>
            <Header />
            <div id="search">
                <div className="main_container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 d-none d-md-block">
                            <FilterList />

                        </div>
                        <div className="col-lg-9 col-md-12">
                            {
                                !isLoading && <div className='header_info'>
                                    <div className='total'>{total} results found</div>
                                    <div className="sort">
                                        <span className='label'>Sort By</span>
                                        <Select
                                            style={{ width: "150px" }}
                                            value={Router.query.sort_by ? Router.query.sort_by : "newest"}
                                            onChange={(value) => syncUrlPage(value, "sort_by")}
                                        >
                                            <Option value="newest">Newest</Option>
                                            <Option value="oldest">Oldest</Option>
                                            <Option value="price-asc">Price: low to high</Option>
                                            <Option value="price-desc">Price: high to low</Option>
                                        </Select>
                                    </div>
                                    <div className="filter_icon">
                                        <i onClick={() => setOpen(true)} className="fas fa-filter"></i>
                                    </div>
                                </div>
                            }

                            <div className="shop_by">

                                <div className={!isLoading && "shop_by_content"}>
                                    {
                                        isLoading ?
                                            <div style={{ textAlign: "center", marginTop: "10vh", width: "100%" }}>
                                                <SpinnerCircularFixed style={{ margin: "0 auto" }} size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
                                            </div> :
                                            products.length > 0 ?
                                                products.map((item, index) => {
                                                    return (
                                                        <ProductCard product={item} key={index} />
                                                    )
                                                }) :
                                                <p>No products found</p>

                                    }




                                </div>
                                {
                                    !isLoading && <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0" }}>
                                        <Pagination
                                            current={Router.query.page && Router.query.page != 0 ? parseInt(Router.query.page) : 1}
                                            showSizeChanger={false}
                                            onShowSizeChange={(c, limit) => syncUrlPage(limit, "limit")}
                                            pageSize={24}
                                            pageSizeOptions={[1, 2, 5]}
                                            onChange={(val) => syncUrlPage(val, "page")} total={total}

                                        />
                                    </div>
                                }


                            </div>
                        </div>
                    </div>
                </div>










                <Drawer style={{ zIndex: "1111111111" }} anchor={"right"} open={open} onClose={toggleDrawer()}>
                    <div style={{ paddingBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span onClick={() => handleCloseDrawer()}><i className="fas fa-times"></i></span>
                            <span>Filter</span>

                        </div>
                        <FilterList />
                    </div>
                </Drawer>
            </div>





        </>
    )
}

export default search
