import React from 'react'

function SideInfo() {
    return (
        <>
            <div className="trade">
                <span>
                    <span className="mr-1">
                        <i className="fas fa-shield-alt"></i>
                    </span>

                    TRADE ASSURANCE
                </span>
                <ul className="list">
                    <li>100% Product quality</li>
                    <li>100% On-time shipment</li>
                    <li>100% Payment protection</li>
                </ul>
            </div>

            <div className="product_policy my-4">

                <ul>
                    <li>
                        <div className="policy">
                            <div className="icon"><i className="fa fa-truck"></i></div>
                            <div className="policy-info">
                                <h4>Free Delivery</h4>
                                <p>On Order Over $49.86</p>
                            </div>
                        </div>

                    </li>
                    <li>
                        <div className="policy">
                            <div className="icon"><i className="fas fa-shield-alt"></i></div>
                            <div className="policy-info">
                                <h4>Order protection</h4>
                                <p>Secured Information</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="policy">
                            <div className="icon"><i className="fa fa-gift"></i></div>
                            <div className="policy-info">

                                <h4>Promotion Gift</h4>
                                <p>Special Offers!</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="policy">
                            <div className="icon"><i className="fas fa-sync-alt"></i></div>
                            <div className="policy-info">
                                <h4>money back</h4>
                                <p>Return over 30 Days</p>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        </>
    )
}

export default SideInfo
