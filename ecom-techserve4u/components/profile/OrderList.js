import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Space } from 'antd';
import moment from 'moment'
import { useRouter } from 'next/router'

const columns = [
  {
    title: 'Order',
    dataIndex: 'invoice',
    key: 'invoice',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Order Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: time => (
      <a>
        {moment(time).format("DD MMM YYYY, hh:mm A")}
      </a>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: text => <a>{text} $</a>
  },
  {
    title: 'Payment',
    key: 'paymentStatus',
    dataIndex: 'paymentStatus',
    render: status => (
      <Tag color={status == "unpaid" ? "red" : 'green'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Status',
    key: 'orderStatus',
    dataIndex: 'orderStatus',
    render: status => (
      <Tag color={'green'}>
        {status}
      </Tag>
    ),
  },

];



function OrderList() {
  const [allOrders, setAllOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const Router = useRouter()


  useEffect(() => {
    setLoading(true)
    axios.get('/order/myOrders')
      .then(res => {
        setAllOrders(res.data.orders);
        setFilteredOrders(res.data.orders);
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err);
      })
  }, [])


  return (
    <>
      <div className='mb-5'>
        <div className="section_heading">
          <span><i className="fas fa-file-alt"></i></span>

          <div className='heading_title'>

            <h5>YOUR ORDERS</h5>
            {/* <button onClick={() => showModal()}>Add New</button> */}
          </div>

        </div>
        <div style={{ overflow: 'auto' }}>
          <Table
            loading={loading}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => { Router.push(`/orders?invoice_no=${record.invoice}`) }, // click row

              };
            }}
            columns={columns}
            dataSource={allOrders} />
        </div>

      </div>
    </>
  )
}

export default OrderList
