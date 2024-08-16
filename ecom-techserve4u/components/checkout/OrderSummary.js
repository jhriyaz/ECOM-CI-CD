import React from 'react'

function OrderSummary({shippingCost,cartItems}) {
    return (
        <>
            <h5 className="heading">Order Summary</h5>
            <div className="summary_list_wrapper">
                {cartItems && Object.keys(cartItems).map((key, index) => (
                    <div key={index} className="summary_list_items">
                        <h6 className="product_name text-capitalize">{cartItems[key].name} x {cartItems[key].qty}</h6>
                        <span className='price'>${cartItems[key].price * cartItems[key].qty}</span>
                    </div>
                ))}
                <div className='total'>
                    <span>Sub Total</span>
                    <span className='price'>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                        const { price, qty } = cartItems[key];
                        return totalPrice + price * qty;
                    }, 0)}</span>
                </div>

                <div className='shipping'>
                    <span>Tax</span>
                    <span className='price'>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                        const { tax, qty } = cartItems[key];
                        return totalPrice + tax * qty;
                    }, 0)}</span>
                </div>
                <div className='shipping'>
                    <span>Shipping Fees</span>
                    <span className='price'>$ {shippingCost}</span>
                </div>
                <div className='total'>
                    <span>Total</span>
                    <span className='price'>$ {cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
                        const { price, qty } = cartItems[key];
                        return totalPrice + price * qty;
                    }, 0) + shippingCost + Object.keys(cartItems).reduce((totalPrice, key) => {
                        const { tax, qty } = cartItems[key];
                        return totalPrice + tax * qty;
                    }, 0)
                    }</span>
                </div>


                {/* <div className="coupon">
                                    <input type="text"
                                        placeholder="Enter coupon" className="couponinput" />
                                    <button className="coupon_button">Apply</button>
                                </div> */}

                {/* {
                                    !placeOrder &&
                                    <>
                                        <div className="coupon">
                                            <input type="text"
                                                placeholder="Enter coupon" className="couponinput" />
                                            <button className="coupon_button">Apply</button>
                                        </div>
                                        <button onClick={() => handleShowPlace()} className="confirm_order primary_btn ">Confirm Order</button>
                                    </>
                                } */}


            </div>
        </>
    )
}

export default OrderSummary
