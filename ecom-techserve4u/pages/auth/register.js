import React, { useState } from 'react';
import { Alert, Spin } from 'antd';
import axios from 'axios'
import { Form, Input, Button, Checkbox, notification } from 'antd';
import Header from '../../components/header/Header';
import Cookies from "js-cookie";
import Link from 'next/link'
import Countdown from 'react-countdown';
import { notificationFunc } from '../../components/global/notification'
import GoogleAuth from '../../components/auth/GoogleAuth';



const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};


const Register = () => {

    const [loading, setLoading] = useState(false)
    const [newCodeTimer, setNewCodeTimer] = useState(Date.now() + 59000)
    const [mount, setMount] = useState(true)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')

    const [error, setError] = useState(null)
    const [isOtpSend, setIsOtpSend] = useState(false)




    const onFinish = (values) => {
        setLoading(true)
        axios.post('/user/signup', values)
            .then(res => {

                if (res.data.isOtpSend) {
                    setError(null)
                    setIsOtpSend(true)
                    setEmail(res.data.email)
                    setMount(false)
                    setLoading(false)
                    setTimeout(() => {
                        setMount(true)
                    }, 100);
                    setNewCodeTimer(Date.now() + 59000)
                }


            })
            .catch(err => {
                setError(err && err.response && err.response.data);
                setLoading(false)
                // console.log(err && err.response && err.response.data);
            })

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCloseAlert = () => {
        setError(null)
    }




    const registerForm = () => (
        <>
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    className="label"
                    validateStatus={error && error.name ? "error" : "succcess"}
                    help={error && error.name ? error.name : null}
                >
                    <Input placeholder="" />
                </Form.Item>


                <Form.Item
                    label="Email"
                    name="email"
                    className="label"
                    validateStatus={error && error.email ? "error" : "succcess"}
                    help={error && error.email ? error.email : null}
                >
                    <Input placeholder="enter your email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    className="label"
                    validateStatus={error && error.password ? "error" : "succcess"}
                    help={error && error.password ? error.password : null}
                >
                    <Input.Password />
                </Form.Item>



                <div className='g_auth' >
                    <button className="primary_btn my-3" disabled={loading} type="primary" htmlType="submit">
                        Register
                        {
                            loading && <Spin size='small' style={{ marginLeft: "10px" }} />
                        }

                    </button>
                    <div className='g_auth'>
                        <GoogleAuth />
                    </div>
                    <span className='register'>Already have an account ? <Link href="/auth/login">Login now!</Link></span>
                </div>


            </Form>



        </>
    )


    const renderer = ({ seconds, completed }) => {
        if (completed) {
            // Render a completed state

            return <button onClick={() => resendOtp()} className="resend_button">Resend Code</button>
        } else {
            // Render a countdown
            return <button className="resend_button">Resend Code ({seconds}s)</button>

        }
    };

    const verifyOtp = () => {
        if (otp.length === 6) {
            axios.post('/user/verifyotp', { email, otp })
                .then(res => {
                    if (res.data.success) {
                        Cookies.set("myshop_auth2", res.data.token);
                        notificationFunc("success", "Registered successfully")
                        setTimeout(() => {
                            window.location.pathname = '/'
                        }, 3000);

                    }
                })
                .catch(err => {
                    err && err.response && setError(err.response.data)
                })
        } else {
            setError({ message: "OTP should be 6 digit" })
        }
    }


    const resendOtp = () => {
        axios.post('/user/resendotp', { email })
            .then(res => {
                if (res.data.isOtpSend) {
                    setError(null)
                    notificationFunc("success", "A new code has been sent to your number")
                    setMount(false)
                    setTimeout(() => {
                        setMount(true)
                    }, 100);
                    setNewCodeTimer(Date.now() + 59000)
                }
            })
            .catch(err => {
                err && err.response && setError(err.response.data)
            })

    }

    const otpForm = () => (
        <>
            <div className="otp">
                <div className="text-center pt-3">
                    <h1> Email Verification</h1>
                    <p>Verification code has been sent to you email. Please wait a few minutes.</p>
                    {/* <button onChange={()=>resendOtp()} className="resend_button">Resend Code</button> */}
                    {
                        mount && <Countdown
                            date={newCodeTimer}
                            renderer={renderer}
                        />}
                </div>
                <div className="px-4 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-12 col-lg">
                            <Input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" />
                            <button disabled={otp.length !== 6} onClick={() => verifyOtp()} className="primary_btn my-3 btn-block">Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


    return (
        <>
            <Header />
            <div className="auth">
                <div className='mb-3'>
                    {
                        error && error.message && <Alert
                            message={error.message}
                            type="error"
                            closable
                            onClose={onCloseAlert}
                        />
                    }
                </div>

                {
                    isOtpSend ? otpForm() : registerForm()
                }

            </div>

        </>
    );
};

export default Register
