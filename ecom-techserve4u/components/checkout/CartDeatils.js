import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeCartItem } from '../../actions/cartActions'
import Link from 'next/link'
function CartDeatils({ onStepChange }) {
    const { open, cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const onQuantityIncrement = (_id) => {
        dispatch(addToCart(cartItems[_id], 1));

    }
    const onQuantityDecrement = (_id, qty) => {
        if (qty === 1) return
        dispatch(addToCart(cartItems[_id], -1));
    };

    const getKey = (object) => {
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
    return (
        <>
            <h5 className="heading">Your Order</h5>
            <div className="checkout_list_wrapper pt-3">


                {cartItems && Object.keys(cartItems).map((key, index) => (
                    <div key={index} className={`${cartItems[key].isAvailable ? "checkout_list_item" : "checkout_list_item unavailable"}`} >
                        <div className="product_img">
                            <img src={cartItems[key].thumbnail ? cartItems[key].thumbnail : "https://via.placeholder.com/80"} alt="" />
                        </div>
                        <div className="product_name">
                            <h3 className='text-capitalize'>{cartItems[key].name}</h3>

                            {
                                Object.keys(cartItems[key].attributes)?.length > 0 &&
                                <div className='mb-1'>{
                                    Object.keys(cartItems[key].attributes).map((key2, index) => {
                                        return (
                                            <>{getKey({ [key2]: cartItems[key].attributes[key2] })}</>
                                        )
                                    })
                                }</div>
                            }

                            <div className="quantity">
                                <span onClick={() => onQuantityIncrement(cartItems[key]._id)}><i className="fas fa-plus"></i></span>
                                <input value={cartItems[key].qty} readOnly defaultValue="1" type="number" />

                                <span onClick={() => onQuantityDecrement(cartItems[key]._id, cartItems[key].qty)}><i className="fas fa-minus"></i></span>
                            </div>
                            {cartItems[key].error && <strong style={{ color: "red", fontSize: "12px" }}>{cartItems[key].error}</strong>}
                        </div>
                        <div className="product_price">
                            <span className='price'>${cartItems[key].price} </span>
                            <button onClick={() => dispatch(removeCartItem(cartItems[key].productId))} className="remove">
                                Remove
                            </button>
                        </div>
                    </div>
                ))

                }
                <div className='d-flex justify-content-between my-3 mt-5'>
                    <Link href='/' className='primary_outline_btn'>Shop More</Link>
                    <button disabled={cartItems && Object.keys(cartItems).length == 0} onClick={() => onStepChange(1)} className='primary_btn'>Continue to shipping</button>
                </div>

            </div>
        </>
    )
}

export default CartDeatils
