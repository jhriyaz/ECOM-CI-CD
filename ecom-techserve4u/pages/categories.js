import React from 'react'
import Header from '../components/header/Header.js'
import { useSelector } from 'react-redux'
import { Card } from 'antd'
import Link from 'next/link'
function categories() {
    const { categories } = useSelector(state => state.general)
    return (
        <>
            <Header />
            <div id="categories_page">
                <div className="main_container">
                    <h3 className="title">Categories</h3>
                    <div className="list_container">
                        {
                            categories && categories.map((cat, index) => {
                                return (
                                    <Card
                                        className="mb-3"
                                        key={index}
                                        title={<Link href={`/search?category=${cat.slug}`}>
                                            {cat.name}
                                        </Link>}>

                                        <div className="row">
                                            {
                                                cat.children.length > 0 && cat.children.map((sub, index2) => {
                                                    return (

                                                        <div key={index2} className="col-6 col-lg-4">
                                                            <Link href={`/search?category=${sub.slug}`}>
                                                                <p className="sub_cat">{sub.name}</p>
                                                            </Link>
                                                            <ul>
                                                                {
                                                                    sub.children.length > 0 && sub.children.map((sub2, index3) => {
                                                                        return (
                                                                            <li key={index3}>
                                                                                <Link href={`/search?category=${sub2.slug}`}>
                                                                                    <p className="subsub" >{sub2.name}</p>
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>

                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default categories
