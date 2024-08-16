import React from 'react'
import moment from 'moment'

function OrderSummary({order}) {
    return (
        <>
            <div className="section_heading">
                <h6>ORDER SUMMARY</h6>
            </div>

            <div className="summary">
                <div className="row">
                    <div className="col-lg-6 col-md-12">

                        <table>
                            <tr >
                                <td>Order Date:</td>
                                <td>{order && moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                            </tr>
                            <tr>
                                <td>Order ID:</td>
                                <td>{order && order.invoice}</td>
                            </tr>

                            <tr>
                                <td> Payment Method:</td>
                                <td>{order && order.paymentMethod || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Payment Status:</td>
                                <td>{order && order.paymentStatus}</td>
                            </tr>
                            <tr>
                                <td>Order Status:</td>
                                <td>{order && order.orderStatus}</td>
                            </tr>
                        </table>



                    </div>
                    <div className="col-lg-6 col-md-12">
                        <table>
                            <tr>
                                <td> Name:</td>
                                <td>{order && order.addressId.name}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>{order && order.addressId.mobileNumber}</td>
                            </tr>
                            <tr>
                                <td> Shipping Region:</td>
                                <td>{order && order.addressId.state}</td>
                            </tr>
                            <tr>
                                <td> Shipping Area:</td>
                                <td>{order && order.addressId.city}</td>
                            </tr>
                            <tr>
                                <td> Zip Code:</td>
                                <td>{order && order.addressId.zip}</td>
                            </tr>
                            <tr>
                                <td> Shipping Address:</td>
                                <td>{order && order.addressId.address}</td>
                            </tr>





                        </table>

                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSummary
