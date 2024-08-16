
import React, { useEffect } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import axios from 'axios'
import { notificationFunc } from '../global/notification'
import {useRouter} from 'next/router'


function Paypal({ shippingCost,addressId,paymentMethods }) {
  const { open, cartItems } = useSelector(state => state.cart)
  const Router = useRouter()
  const dispatch = useDispatch()

  let totalAmount = cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
    const { price, qty } = cartItems[key];
    return totalPrice + price * qty;
  }, 0) + shippingCost + Object.keys(cartItems).reduce((totalPrice, key) => {
    const { tax, qty } = cartItems[key];
    return totalPrice + tax * qty;
  }, 0)


  let tax = cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
    const { tax, qty } = cartItems[key];
    return totalPrice + tax * qty;
}, 0)


  let items = Object.keys(cartItems).map((key) => ({
    thumbnail: cartItems[key].thumbnail,
    productSlug: cartItems[key].slug,
    productName: cartItems[key].name,
    payablePrice: cartItems[key].price,
    purchasedQty: cartItems[key].qty,
    variations: cartItems[key].attributes,
    campaign: cartItems[key].campaign,
    _id: cartItems[key]._id
  }))


  const payment = (data, actions) => {


    let info = {
      items,
      totalAmount
    }

    // 2. Make a request to your server
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/payment`, info)
      .then(function (res) {
        // 3. Return res.id from the response
        return res.data.id;
      })
      .catch(err => {
        err && err.response && notificationFunc("error", err.response.data.error)
      })
  }

  const execute = (data, actions) => {
    // 2. Make a request to your server
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/paymentSuccess`, {
      paymentID: data.paymentID,
      payerID: data.payerID,
      items,
      totalAmount,
      addressId,
      shipping:shippingCost,
      tax
    })
      .then(res=> {
        localStorage.removeItem("cart")
        dispatch({
          type: "RESET_CART"
        })
          Router.push('/user/profile?tab=orders')
        
      })
      .catch(err => {
        err && err.response && notificationFunc("error", err.response.data.error)
      })
  }

  useEffect(() => {
    window.paypal.Button.render({
      env:paymentMethods.filter(m=>m.name === 'paypal')[0].isSandbox? 'sandbox':"production", // Or 'production'
      // Set up the payment:
      // 1. Add a payment callback
      payment: payment,
      // Execute the payment:
      // 1. Add an onAuthorize callback
      onAuthorize: execute
    }, "#paypal_button");
  }, [])
  return (
    <>
      <button className='primary_outline_btn' id="paypal_button"></button>
    </>
  )
}

export default Paypal
