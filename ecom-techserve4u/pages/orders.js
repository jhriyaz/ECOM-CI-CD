import React, { useState, useEffect } from 'react'
import Header from '../components/header/Header.js'
import { Popconfirm, Button, Select, Input } from 'antd';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import axios from 'axios'
import moment from 'moment'

import WithAuth from '../helper/protectedRoute'
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux'
import OrderLists from '../components/order-details/OrderLists.js';
import { useRouter } from 'next/router'
import OrderSummary from '../components/order-details/OrderSummary.js';
import OrderDetails from '../components/order-details/OrderDetails.js';
import InvoiceGenerator from '../components/order-details/InvoiceGenerator'

function getSteps() {
    return ['Pending', 'Processing', "Shipped", "delivered"];
}

function reverse(array) {
    return array.map((item, idx) => array[array.length - 1 - idx])
}

function orders() {
    let Router = useRouter()
    const [activeStep, setActiveStep] = useState(0);
    const { paymentMethods } = useSelector(state => state.general)
    const steps = getSteps();

    const [order, setOrder] = useState(null)


    const { invoice_no } = Router.query
    useEffect(() => {
        if (Router.query.invoice_no) {
            axios.get(`/order/single/${Router.query.invoice_no}`)
                .then(res => {
                    setOrder(res.data.order);
                    if (res.data.order.orderStatus === "pending") {
                        setActiveStep(0)
                    }
                    if (res.data.order.orderStatus === "processing") {
                        setActiveStep(1)
                    }
                    if (res.data.order.orderStatus === "shipped") {
                        setActiveStep(2)
                    }
                    if (res.data.order.orderStatus === "delivered") {
                        setActiveStep(3)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [invoice_no])



    const requestRefund = () => {
        axios.patch("/order/refundRequest/", { invoice: invoice_no, type: order.orderStatus })
            .then(res => {
                setOrder(res.data.order);
            })
            .catch(err => {
                console.log(err);
            })
    }

    //console.log(selectedMethod);
    return (
        <>
            <Header />
            <div id="orderdetails">
                <div className="main_container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <OrderLists />
                        </div>
                        <div className="col-lg-8 col-md-12">
                            <div className="details">
                                <div className="header_info py-4">
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
                                        <div>
                                            <h5>Invoice: {order && order.invoice}</h5>
                                            <span >{moment(order && order.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
                                        </div>

                                        {
                                            order && <InvoiceGenerator order={order} />
                                        }
                                    </div>
                                    {
                                        order && order.paymentStatus === 'paid' ?
                                            <Popconfirm
                                                title="Are you sure to request for refund?"
                                                onConfirm={() => requestRefund()}
                                                onCancel={null}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button style={{marginLeft:"10px"}} type="danger">Request Refund</Button>
                                            </Popconfirm> :
                                            order && order.paymentStatus === 'refundRequested' ? <Button style={{marginLeft:"10px"}} type="danger">Refund Requested</Button> :
                                                order && order.paymentStatus === 'refunded' && <Button style={{marginLeft:"10px"}} type="danger">Refunded</Button>
                                    }



                                </div>
                                <div className="step">
                                    <Stepper activeStep={activeStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                {
                                                    order && order.orderStatus === 'cancelled' ?
                                                        <StepLabel icon={<CloseIcon style={{ background: "red", color: "white", borderRadius: "50%" }}></CloseIcon>} >{label}</StepLabel> :
                                                        <StepLabel >{label}</StepLabel>

                                                }
                                            </Step>
                                        ))}
                                    </Stepper>
                                </div>

                                <div className="order_section">
                                    <OrderSummary order={order} />
                                </div>


                                <div className="order_section">
                                    <OrderDetails order={order} />
                                </div>


                                <div className="order_section">
                                    <div className="section_heading">
                                        <h6>ORDER TIMELINE</h6>
                                    </div>
                                </div>

                                <div className="steps" style={{ paddingBottom: "30px" }}>
                                    {/* <Steps current={2}  direction="vertical">
          <AntStep title="Step 1" description="This is a description." />
          <AntStep title="Step 2" description="This is a description." />
          <AntStep title="Step 3" description="This is a description." />

        </Steps> */}




                                    <div className="container">
                                        <div className="timeline">

                                            {
                                                order && reverse(order.orderHistories).map((history, index) => {
                                                    return (
                                                        <div key={index} className="timeline-container primary">
                                                            <div className="timeline-icon">
                                                                <i className="far fa-grin-wink"></i>
                                                            </div>
                                                            <div className="timeline-body">
                                                                <h4 className="timeline-title"><span className="badge">{history.type}</span></h4>
                                                                <p>{history.note}</p>
                                                                <p className="timeline-subtitle">{moment(history.date).fromNow()}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }


                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithAuth(orders)
