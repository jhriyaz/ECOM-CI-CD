import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Tag } from 'antd'
import moment from 'moment'


function OrderLists() {
    let Router = useRouter()
    const [orders, setOrders] = useState([])
    const { invoice_no } = Router.query
    useEffect(() => {
        axios.get('/order/myOrders')
            .then(res => {
                setOrders(res.data.orders);
                if (!Router.query.invoice_no) {
                    Router.push(`/orders?invoice_no=${res.data.orders[0].invoice}`)
                }
            })
            .catch(err => {
                console.log(err);
            })


    }, [])


    return (
        <div>
            <div className="order_list">
                <div className="header">
                    <h5>Your Orders</h5>

                </div>

                <div className="list_items">
                    {
                        orders.map((order, index) => {
                            return (
                                <Link key={index} href={`/orders?invoice_no=${order.invoice}`}>
                                    <div>
                                        <div className={`order_item ${invoice_no && invoice_no === order.invoice && "active"}`}>
                                            <div className="order_row">
                                                <h4 className="invoice">{order.invoice}</h4>
                                                <div className="status">
                                                    <Tag color='magenta' className="order_status">{order.orderStatus}</Tag>
                                                    <Tag color='green' className="payment_status">{order.paymentStatus}</Tag>
                                                </div>
                                            </div>
                                            <div className="order_row">
                                                <div className="amount">$ {order.totalAmount}</div>
                                                <div className="date mr-2">
                                                    {moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderLists
