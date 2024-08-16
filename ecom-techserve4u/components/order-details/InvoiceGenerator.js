import React from "react";
import ReactToPrint from "react-to-print";
import { FaPrint } from "react-icons/fa";

class ComponentToPrint extends React.Component {
    render() {
        const { order } = this.props
        console.log(order);
        return (
            <div className='print-source'>
                <div className="invoice-box">
                    <table cellpadding="0" cellspacing="0">
                        <tr className="top">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td className="title">
                                            <img src="/logo.png" style={{ width: "100%", maxWidth: "300px" }} />
                                        </td>

                                        <td>
                                            Invoice #: {order.invoice}<br />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr className="information">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                            28751 Rayan Road, Warren,<br />
                                            Michigan 48092<br />
                                            Opposite of IONA Masjid (12 Mile)
                                        </td>

                                        <td>
                                            {order.addressId.name}<br />
                                            {order.addressId.address || "N/A"}<br />
                                            {order.addressId.city},{order.addressId.state},{order.addressId.zip}<br />
                                            {order.addressId.mobileNumber || "N/A"}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr className="heading">
                            <td>Payment Method</td>
                            <td>{order.paymentMethod}</td>
                        </tr>

                        {/* <tr className="details">
                            <td>{order.paymentMethod}</td>
                        </tr> */}

                        <tr className="heading">
                            <td>Item</td>

                            <td>Price</td>
                        </tr>

                        {
                            order.items.map((item, index) => (
                                <tr key={index} className="item">
                                    <td>{item.productName}</td>

                                    <td>৳ {item.payablePrice} X {item.purchasedQty}</td>
                                </tr>
                            ))
                        }


                        {/* <tr className="item last">
                            <td>Domain name (1 year)</td>

                            <td>$10.00</td>
                        </tr> */}

                        <tr className="total">
                            <td></td>
                            <td>Shipping: ৳{order && order.shipping}</td>
                        </tr>
                        <tr className="total">
                            <td></td>
                            <td>Tax: ৳{order && order.tax}</td>
                        </tr>
                        <tr className="total">
                            <td></td>

                            <td>Total: ৳{order && order.totalAmount}</td>
                        </tr>
                        <tr className="total">
                            <td></td>
                            <td>Paid: ৳{order && order.paidAmount}</td>
                        </tr>
                        <tr className="total">
                            <td></td>
                            <td>Due: ৳{order && order.totalAmount - order.paidAmount}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}

class InvoiceGenerator extends React.Component {
    render() {
        const { order } = this.props
        return (
            <div>
                <ReactToPrint
                    trigger={() => <button className='print_button primary_btn'><FaPrint style={{ marginRight: "10px" }} />Print Invoice</button>}
                    content={() => this.componentRef}
                />
                <ComponentToPrint order={order} ref={el => (this.componentRef = el)} />
            </div>
        );
    }
}

export default InvoiceGenerator;
