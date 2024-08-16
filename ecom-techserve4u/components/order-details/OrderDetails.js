import React, { useState } from 'react'
import Link from 'next/link'
import { Button, Modal, Input } from 'antd'
import axios from 'axios'
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { notificationFunc } from '../global/notification'


const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};


function OrderDetails({ order }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [review, setReview] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [hover, setHover] = React.useState(-1);

    const showModal = (product) => {

        axios.get(`/review/getsingle/${product.productId}/${order._id}`)
            .then(res => {
                if (res.data.hasReview) {
                    setReview(res.data.review)
                    setComment(res.data.review.comment)
                    setRating(res.data.review.rating)
                }
                setSelectedProduct(product)
                setIsModalVisible(true);
            })
            .catch(err => {
                console.log(err);
            })

    };

    const handleSave = () => {
        if (!selectedProduct) {
            return alert("No product selected")
        }
        let data = {
            rating,
            comment,
            order: order._id,
            product: selectedProduct.productId
        }

        axios.post('/review/create', data)
            .then(res => {
                if (res.data.success) {
                    handleCancel()
                    notificationFunc("success", "Review saved successfully")
                }
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setReview(null)
        setComment("")
        setRating(5)
        setSelectedProduct(null)

    };
    return (
        <>
            <Modal
                zIndex={1111}
                title={`Review for ${selectedProduct && selectedProduct.productName}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={() => handleCancel()}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={false} onClick={() => handleSave()}>
                        Submit
                    </Button>,
                ]}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Rating
                        name="hover-feedback"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                    />
                    {rating !== null && <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>}
                </div>
                <Input.TextArea placeholder="Write your review" value={comment} onChange={(e) => setComment(e.target.value)} />
            </Modal>


            <div className="section_heading">
                <h6>ORDER DETAILS</h6>
            </div>

            <div className="item_details p-4">
                <div className="overflow-auto">
                    <table className="w-100 border_bottom">
                        <tbody>
                            <tr className="border_bottom">
                                <td style={{ width: "60%" }} >Description</td>
                                <td className='text-center' >Quantity</td>
                                <td className='text-center'>Amount</td>

                            </tr>

                            {
                                order && order.items.map((item, index) => {
                                    return (
                                        <tr key={index} className="">
                                            <td className="mt-2">
                                                <div className="d-flex align-items-center mt-2">
                                                    <div className="">
                                                        <img style={{ height: "80px", width: "80px", objectFit: "cover", marginRight: "10px" }} src={item.thumbnail} />
                                                    </div>
                                                    <div className="">
                                                        <Link href={`/product/${item.productSlug}`}>

                                                            <p className="">{item.productName}</p>

                                                        </Link>
                                                        {
                                                            order.orderStatus === 'delivered' && <button onClick={() => showModal(item)} style={{ padding: "2px 10px" }} className='primary_outline_btn'>Review</button>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <p className='font-weight-bold'>$ {item.payablePrice} X {item.purchasedQty}</p>
                                            </td>
                                            <td className="text-center">
                                                <p className='font-weight-bold'>$ {parseInt(item.payablePrice) * parseInt(item.purchasedQty)}</p>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>


                    <table className='w-100 mt-4'>
                        <tbody className='mt-4'>
                            <tr >
                                <td style={{ width: "50%" }}>Status: {order && order.paymentStatus}
                                    {
                                        order && order.paymentStatus === 'unpaid' && !order.paymentMethod && <button onClick={() => showModal()} className='primary_btn ml-2'>Pay Now</button>
                                    }

                                </td>
                                <td style={{ width: "13%" }}>
                                    <span>Total price :</span>
                                    <div className='font-weight-bold'>$ {order && order.totalAmount}</div>
                                </td>
                                <td className='text-center' style={{ width: "13%" }}>
                                    <span>Total paid :</span>
                                    <div className='font-weight-bold'>$ {order && order.paidAmount}</div>
                                </td>
                                <td className='text-center' style={{ width: "13%" }}>
                                    <span >Due :</span>
                                    <div className='font-weight-bold'>$ {order && order.totalAmount - order.paidAmount}</div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default OrderDetails
