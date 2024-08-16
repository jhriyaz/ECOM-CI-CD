import React from 'react'
import { IoMapOutline, IoCartOutline, IoCardOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
function CheckoutHeader({step}) {
    return (
        <>
            <div className="container container-sm ">
                <div className="row cols-delimited justify-content-center">
                    <div className="col">
                        <div className={`text-center ${step == 1 && "active"}`}>
                            <div className="mb-0">
                                <IoCartOutline className='icon' />
                            </div>
                            <div className="block-content d-none d-md-block">
                                <h3 className="heading text-capitalize">1. My Cart</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className={`text-center ${step == 2 && "active"}`}>
                            <div className="mb-0">
                                <IoMapOutline className='icon' />
                            </div>
                            <div className="block-content d-none d-md-block">
                                <h3 className="heading  text-capitalize">2. Shipping info</h3>
                            </div>
                        </div>
                    </div>


                    <div className="col">
                        <div className={`text-center ${step == 3 && "active"}`}>
                            <div className="mb-0">
                                <IoCardOutline className='icon' />
                            </div>
                            <div className="block-content d-none d-md-block">
                                <h3 className="heading text-capitalize">3. Payment</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className={`text-center ${step == 4 && "active"}`}>
                            <div className="mb-0">
                                <IoCheckmarkCircleOutline className='icon' />
                            </div>
                            <div className="block-content d-none d-md-block">
                                <h3 className="heading text-capitalize">4. Confirmation</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutHeader
