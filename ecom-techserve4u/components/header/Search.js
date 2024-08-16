import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Search() {
    const Router = useRouter()
    const [query, setQuery] = useState("")
    const [searchedProducts, setSearchedProducts] = useState([])

    useEffect(() => {

        const delayed = setTimeout(() => {
            if (query === '') {
                return setSearchedProducts([])
            }
            axios.get(`/product/getSearchProducts?search=${query.trim()}`)
                .then(res => {
                    setSearchedProducts(res.data.products);

                })
                .catch(err => {
                    setSearchedProducts([])
                })

        }, 100)
        return () => {
            clearTimeout(delayed)
        }
    }, [query])

    useEffect(() => {
        if (query === '' && searchedProducts.length > 0) {
            setSearchedProducts([])
        }
    }, [query, searchedProducts])

    let handleKey = (e) => {

        if (e.keyCode === 13) {
            e.preventDefault()
            setSearchedProducts([])
            Router.push(`/search?query=${query.trim()}`)
        }
    }
    const handlePush = () => {
        setSearchedProducts([])
        Router.push(`/search?query=${query.trim()}`)
    }


    return (
        <div className="search_wrapper">
            <input onKeyDown={(e) => handleKey(e)} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search for..."></input>
            <i onClick={() => handlePush()} className="fas fa-search"></i>
            <div className={`search_overlay ${searchedProducts.length == 0 && "d-none"}`}>
                <div className="search_products">
                    {

                        searchedProducts.length > 0 && searchedProducts.map((product, index) => {
                            return (
                                <Link key={index} href={`/product/${product.slug}`}>
                                    <div>
                                        <div className="items">
                                            <img src={product.thumbnail}></img>
                                            <h5>{product.name}</h5>
                                            <div className="product-price">
                                                {
                                                    product?.discount?.value > 0 ?
                                                        <>
                                                            <span className="old-price">${product.price}</span>
                                                            {
                                                                product.discount.discountType === 'flat' ?
                                                                    <span className="new-price">${product.price - product.discount.value}</span> :
                                                                    <span className="new-price">${product.price - Math.floor((product.price * (product.discount.value / 100)))}</span>
                                                            }

                                                        </> :
                                                        <span className="new-price">${product.price}</span>
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </Link>



                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Search
