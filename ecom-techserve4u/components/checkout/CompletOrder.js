import React from 'react'
import { Result, Button } from 'antd';
import Router from 'next/router'
function CompletOrder({ isPaymentSuccess }) {
    return (
        <div style={{background:"white",padding:"20px",marginTop:"20px"}}>
            {
                isPaymentSuccess ? <Result
                    status="success"
                    title="Order Placed Successfully"
                    //subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    extra={[
                        <Button onClick={() => Router.push('/user/profile?tab=orders')} type="primary" key="console">
                            Go To Order Page
                        </Button>,
                        <Button onClick={() => Router.push('/')} key="buy">Buy Again</Button>
                    ]}
                /> :
                    <Result
                        status="error"
                        title="Pyment Failed"
                        subTitle="Go to order page and pay again"
                        extra={[
                            <Button onClick={() => Router.push('/user/profile?tab=orders')} type="primary" key="console">
                                Go To Order Page
                            </Button>,
                            <Button onClick={() => Router.push('/')} key="buy">Buy Again</Button>
                        ]}
                    />
            }
        </div>
    )
}

export default CompletOrder
