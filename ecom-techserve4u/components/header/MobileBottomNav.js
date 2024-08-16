import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Badge } from 'antd';
function MobileBottomNav() {
    const { isAuthenticated } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const Router = useRouter()
    const handleOpenCart = () => {
        dispatch({
            type: "CART_OPEN"
        })
    }
    return (
        <div className="mobile_bottom_container">
            <span onClick={() => handleOpenCart()}>
                <Badge count={cartItems && Object.keys(cartItems).length || 0}>
                    <i className="fas fa-shopping-bag"></i>
                </Badge>

                <span>Cart</span>
            </span>
            <span className="middle_icon">
                <Link href='/'>D</Link>
            </span>
            <span onClick={() => isAuthenticated ? Router.push('/user/profile') : Router.push('/auth/login')}>
                <i className="far fa-user"></i>
                <span>Account</span>
            </span>
        </div>
    )
}

export default MobileBottomNav
