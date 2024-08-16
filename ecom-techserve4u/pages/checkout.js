import React, { useState, useEffect } from 'react'
import CartDeatils from '../components/checkout/CartDeatils.js'
import PaymentMethod from '../components/checkout/PaymentMethod.js'
import Header from '../components/header/Header.js'
import { useSelector, useDispatch } from 'react-redux'


import Address from '../components/checkout/Address.js'
import { notificationFunc } from '../components/global/notification'
import axios from 'axios'
import CompletOrder from '../components/checkout/CompletOrder.js'
import Router from 'next/router'
import { updateCart } from '../actions/cartActions'
import { Modal, Button, Input } from 'antd';
import CheckoutHeader from '../components/checkout/CheckoutHeader.js'
import OrderSummary from '../components/checkout/OrderSummary.js'



function checkout() {
    const { open, cartItems } = useSelector(state => state.cart)
    const { addresses } = useSelector(state => state.general)
    const { isAuthenticated } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [step, setStep] = useState(1)

    const [selectedAddress, setSelectedAddress] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod")
    const [shippingCost, setShippingCost] = useState(0)
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(true)

    const [isLodingOrder, setIsLodingOrder] = useState(false)
    // console.log(selectedAddress);

    const [method, setMethod] = useState(null)
    const [transactionId, setTransactionId] = useState("")


useEffect(() => {
    axios.get(`/settings/getactivemethod`)
    .then(res=>{
        setPaymentMethods(res.data.methods)
    })
    .catch(err=>{
        console.log(err);
    })
}, [])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!transactionId) {
            notificationFunc("error", "Please enter your transaction Id")
        } else {
            handleConfirmOrder(transactionId)
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false)
        setTransactionId("")
        setMethod(null)
    };

    const checkToOrder = () => {
        if (selectedPaymentMethod === "venmo" || selectedPaymentMethod === "cashApp" || selectedPaymentMethod === 'zelle') {
            let filtered = paymentMethods.filter(m => m.name === selectedPaymentMethod)[0]
            setMethod(filtered)
            showModal()
        } else {
            handleConfirmOrder()
        }

    }


    const getTotalAmount = () => {
        return cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
            const { price, qty } = cartItems[key];
            return totalPrice + price * qty;
        }, 0) + shippingCost + Object.keys(cartItems).reduce((totalPrice, key) => {
            const { tax, qty } = cartItems[key];
            return totalPrice + tax * qty;
        }, 0)
    }



    const handleConfirmOrder = (transactionId) => {
        setIsLodingOrder(true)
        let totalAmount = cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
            const { price, qty } = cartItems[key];
            return totalPrice + price * qty;
        }, 0) + shippingCost + Object.keys(cartItems).reduce((totalPrice, key) => {
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
            productId: cartItems[key].productId
        }))

        let tax = cartItems && Object.keys(cartItems).reduce((totalPrice, key) => {
            const { tax, qty } = cartItems[key];
            return totalPrice + tax * qty;
        }, 0)


        let data = {
            addressId: selectedAddress,
            paymentMethod: selectedPaymentMethod,
            totalAmount,
            items,
            paidAmount: 0,
            paymentStatus: 'unpaid',
            orderStatus: "pending",
            tax,
            shipping: shippingCost,
            transactionId: transactionId || ""

        }


        axios.post('/order/create', data)
            .then(res => {
                if (res.data.success) {
                    localStorage.removeItem("cart")
                    dispatch({
                        type: "RESET_CART"
                    })
                    setStep(step => step + 1)
                    setIsPaymentSuccess(true)
                    if (res.data.url) {
                        return window.location.href = res.data.url
                    } else {
                        Router.push('/orders')
                    }
                    setIsLodingOrder(false)
                }
            })
            .catch(err => {
                dispatch(updateCart())
                setStep(1)
                setIsLodingOrder(false)
                err && err.response && notificationFunc("error", err.response.data.error)
            })
    }




    useEffect(() => {
        var items = Object.keys(cartItems).map(key => {
            return cartItems[key];
        })
        setShippingCost(items.reduce(function (acc, obj) { return acc + parseInt(obj.shipping?.cost || 0) }, 0))
    }, [cartItems])

    return (

        <>
            <Header />
            <div id="checkout">
                <Modal
                    zIndex={1111}
                    title={method && method.name}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={() => handleCancel()}>
                            Cancel
                    </Button>,
                        <Button disabled={!transactionId} key="submit" type="primary" loading={isLodingOrder} onClick={() => handleOk()}>
                            Confirm
                    </Button>,
                    ]}
                >
                    {
                        method && <p> {method.text}</p>

                    }
                    <Input value={transactionId} onChange={e => setTransactionId(e.target.value)} type="text" placeholder={`Enter your ${selectedPaymentMethod} transaction id`}></Input>

                </Modal>
                <div className="main_container">
                    <section className="slice-xs border-bottom">
                        <CheckoutHeader step={step} />
                    </section>
                    <div className="row my-4">
                        <div className={`col-lg-${step === 4 ? 12 : 7} col-md-12 mb-4`}>

                            {
                                step === 1 ? <CartDeatils onStepChange={() => {
                                    isAuthenticated ? setStep(prev => prev + 1) :
                                        Router.push('/auth/login')

                                }} /> :
                                    step === 2 ? <Address
                                        setAddresses={(data) => setAddresses(prev => [...prev, data])}
                                        addresses={addresses}
                                        selectedAddress={selectedAddress}
                                        setSelectedAddress={(e) => setSelectedAddress(e.target.value)}
                                        onStepChange={(value) => {
                                            value === -1 ? setStep(prev => prev + value) : selectedAddress ? setStep(prev => prev + value) :
                                                notificationFunc("warning", "Please select a addres or add a new one")
                                        }}
                                    /> :
                                        step === 3 ? <PaymentMethod
                                        paymentMethods={paymentMethods}
                                        addressId={selectedAddress}
                                        shippingCost={shippingCost}
                                            isLoading={isLodingOrder}
                                            handleConfirmOrder={() => checkToOrder()}
                                            onChangeMethod={(e) => setSelectedPaymentMethod(e.target.value)}
                                            selectedPaymentMethod={selectedPaymentMethod}
                                            onStepChange={(value) => {
                                                setStep(prev => prev + value)
                                            }} /> :
                                            step === 4 ?
                                                <CompletOrder
                                                    isPaymentSuccess={isPaymentSuccess}
                                                /> :
                                                null
                            }
                        </div>

                        <div className={`col-lg-5 col-md-12 d-${step === 4 ? "none" : "block"}`}>
                            <OrderSummary shippingCost={shippingCost} cartItems={cartItems} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default checkout
