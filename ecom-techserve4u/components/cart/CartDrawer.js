
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useSelector, useDispatch } from 'react-redux'
import { removeCartItem } from '../../actions/cartActions'
import Link from 'next/link'
import {useRouter} from 'next/router'


const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function CartDrawer({ cartState, onCloseCart }) {

    const { open, cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const classes = useStyles();
    const Router = useRouter()
    const [state, setState] = useState(true);
    const [total, setTotal] = useState(0)
    const [shippingCost, setShippingCost] = useState(0)


    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        dispatch({
            type: "CART_CLOSE"
        })
    };

    const handleCloseCart = (from_checkout) => {
        dispatch({
            type: "CART_CLOSE"
        })
        from_checkout && Router.push('/checkout')
        

    }


    const getKey = (object) => {
        //console.log(object);
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                //alert(key); // 'a'
                return (
                    <span className='mr-2'>
                        <span className='key'>{key}</span>:
                        <span className='value'>{object[key]}</span>;
                    </span>
                )
            }
        }
    }

    
    useEffect(() => {
        var items = Object.keys(cartItems).map(key => {
            return cartItems[key];
        })
      

        setShippingCost(items.reduce(function (acc, obj) { return acc +parseInt(obj.shipping?.cost||0) }, 0))
    }, [cartItems])


    return (
        <div>
            <Drawer anchor={"right"} open={open} onClose={toggleDrawer()}>
                <div className="cart_sidebar_content">
                    <div className="cart_header">
                        <span onClick={() => handleCloseCart()}><i className="fas fa-times"></i></span>
                        <span>My cart</span>

                    </div>
                    <div className="cart_content">
                        <div className="item_wrapper">
                            {cartItems && Object.keys(cartItems).map((key, index) => (
                                <div key={index} className={`${cartItems[key].isAvailable?"cart_item":"cart_item unavailable"}`}>
                                    <div className="product_img">
                                        <img src={cartItems[key].thumbnail ? cartItems[key].thumbnail : "https://via.placeholder.com/50"} alt="" />
                                    </div>
                                    <div className="product_name">
                                        <h5>{cartItems[key].name}</h5>
                                        <span>${cartItems[key].price} x {cartItems[key].qty}</span>
                                        <span>{
                                            Object.keys(cartItems[key].attributes)?.length > 0 &&
                                            Object.keys(cartItems[key].attributes).map((key2, index) => {
                                                return (
                                                    <>{getKey({[key2]:cartItems[key].attributes[key2]})}</>
                                                )
                                            })
                                        }</span>
                                        {cartItems[key].error &&  <strong style={{color:"red",fontSize:"12px"}}>{cartItems[key].error}</strong>}
                                       
                                    </div>
                                    <div className="action_button">
                                        <i onClick={() => dispatch(removeCartItem(cartItems[key].productId))} className="far fa-trash-alt"></i>
                                    </div>
                                </div>
                            ))}








                        </div>
                    </div>
                    <div className="cart_footer">
                        <div className="total">
                            <span>Sub Total:</span>
                            <span>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                                const { price, qty } = cartItems[key];
                                return totalPrice + price * qty;
                            }, 0)}
                            </span>
                        </div>
                        <div className="total">
                            <span>Tax:</span>
                            <span>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                                const { tax,qty } = cartItems[key];
                                return totalPrice + tax*qty;
                            }, 0)}</span>
                        </div>
                        <div className="total">
                            <span>Shipping:</span>
                            <span>$ {shippingCost}</span>
                        </div>
                        <div className="total">
                            <span>Total:</span>
                            <span>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                                const { price, qty } = cartItems[key];
                                return totalPrice + price * qty;
                            }, 0)+shippingCost+Object.keys(cartItems).reduce((totalPrice, key) => {
                                const { tax,qty } = cartItems[key];
                                return totalPrice + tax*qty;
                            }, 0)
   
                            }
                            </span>
                        </div>
                        
                            <button disabled={cartItems && Object.keys(cartItems).length == 0} onClick={() => handleCloseCart("from_checkout")} className="btn btn-block primary_btn">Proceed to checkout</button>
                       

                    </div>
                </div>
            </Drawer>
        </div>
    );
}













