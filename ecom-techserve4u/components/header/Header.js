import Head from 'next/head'
import CartDrawer from '../cart/CartDrawer.js'
import MobileBottomNav from './MobileBottomNav.js'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserMenu from './UserMenu'
import UserDrawer from './UserDrawer.js'
import CategoryDropdown from './CategoryDropdown.js'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Badge } from 'antd';
import Link from 'next/link'
import MobileHeader from './MobileHeader.js'
import Search from './Search.js'
import NotificationComp from './NotificationComp'
import { getNotifications } from '../../actions/generalActions'


export default function Header() {
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const { categories } = useSelector(state => state.general)
    const Router = useRouter()



    const [userDrawerOpen, setUserDrawerOpen] = useState(false)
    const [anchor, setAnchor] = useState(null);
    const [showDropCat, setShowDropCat] = useState(false)




    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getNotifications());
        }
    }, [Router.pathname, isAuthenticated])



    useEffect(() => {
        if (Router.route === '/') {
            setShowDropCat(false)
        } else {
            setShowDropCat(true)
        }
    }, [Router])

    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setUserDrawerOpen(false)

    };

    const closeUserDrawer = () => {
        setUserDrawerOpen(false)
    }


    const handleCartOpen = () => {
        dispatch({
            type: "CART_OPEN"
        })
    }

    const handleClickUser = (event) => {
        if (isAuthenticated) {
            setUserDrawerOpen(true)
        } else {
            setAnchor(event.currentTarget);
        }
    }

    const handleClose = () => {
        setAnchor(null);
    };



    return (
        <>
            <div className="top_nav">
                <div className="main_container">
                    <div className="left_info">
                        <div className="item">
                            <i className="fas fa-phone"></i>
                            <span>09630000000</span>
                        </div>
                        <div className="item">
                            <i className="far fa-envelope"></i>
                            <span>support@yoursite.com</span>
                        </div>

                    </div>
                    <div className="Right_info">
                        <i className="fas fa-mobile-alt"></i>
                        <span>Download our app</span>
                    </div>
                </div>
            </div>
            <header id="header" className="sticky-top" >



                <div className="main_nav_container">
                    <nav className="main_nav">
                        <div className="main_container">
                            <div className="logo">
                                <i onClick={() => setUserDrawerOpen(true)} className="fas fa-bars mr-3"></i>
                                <Link href="/"><p><img src='/logo.png'></img></p></Link>
                                {/* <Link href="/"><a>Protocol Inc</a></Link> */}
                            </div>


                            <Search />


                            <div className="header_info">
                                <span onClick={() => handleCartOpen()}>
                                    <Badge count={cartItems && Object.keys(cartItems).length || 0}>
                                        <i className="fas fa-shopping-bag"></i>
                                    </Badge>

                                </span>
                                {
                                    isAuthenticated && <NotificationComp />
                                }
                                <span onClick={handleClickUser}><i className="far fa-user"></i></span>
                            </div>
                        </div>
                    </nav>

                    <nav className="bottom_nav">
                        <div className="main_container">
                            <div className="categories">
                                <i onClick={() => setUserDrawerOpen(true)} className="fas fa-bars"></i>
                                <div className="cat_menu_hover">
                                    <span className='mr-2'>Categories</span>
                                    <i className="fas fa-arrow-down"></i>
                                </div>

                                {
                                    showDropCat && <CategoryDropdown categories={categories} />
                                }

                            </div>
                            <div className="pages_list">
                                <li><Link href="/campaigns">Campaigns</Link></li>
                                <li><Link href="/brands">Brands</Link></li>
                                <li><Link href="/categories">Categories</Link></li>
                                <li><a href="#">Help</a></li>
                                <li><a href="#">FAQ</a></li>
                            </div>
                        </div>


                    </nav>
                </div>

                <MobileHeader setUserDrawerOpen={() => setUserDrawerOpen(true)} />
            </header>
            <MobileBottomNav />
            <CartDrawer />
            <UserMenu handleClose={handleClose} anchor={anchor} />
            <UserDrawer categories={categories} closeUserDrawer={closeUserDrawer} userDrawerState={userDrawerOpen} onCloseUserDrawer={toggleDrawer} />
        </>
    )
}
