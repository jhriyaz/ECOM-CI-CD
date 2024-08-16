import React, { useState, useEffect } from 'react'
import validator from 'validator'
import axios from 'axios'
import { message, Alert, Spin, Button, Form, Input } from 'antd'
import { notificationFunc } from '../global/notification'

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

function Forgot({ handleNewPassForm }) {
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const emailValidator = (email) => {
        let error = {}
        if (!email) {
            error.email = 'Enter your email'
        } else if (!validator.isEmail(email)) {
            error.email = 'Enter your valid email'
        }

        return {
            error,
            isError: Object.keys(error).length == 0
        }
    }


    const onFinish = (values) => {
        
        const validate = emailValidator(values.email)

        if (!validate.isError) {
            return setErrors(validate.error)
        }

        setErrors(null)
        setIsLoading(true)
        axios.post('/user/forgotPassword',  values )
            .then(res => {
                let { isOtpSend, success, token } = res.data
                if (isOtpSend) {
                    notificationFunc("success", "A code has been sent to your Email")
                    handleNewPassForm(values.email)

                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.log(err);
                err && err.response && setErrors(err.response.data)
                setIsLoading(false)
            })

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };




    const handleSubmit = (e) => {
        e.preventDefault()
        const validate = emailValidator(email)

        if (!validate.isError) {
            return setErrors(validate.error)
        }

        setErrors(null)
        setIsLoading(true)
        axios.post('/user/forgotPassword', { email })
            .then(res => {
                let { isOtpSend, success, token } = res.data
                if (isOtpSend) {
                    notificationFunc("success", "A code has been sent to your Email")
                    handleNewPassForm(email)

                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.log(err);
                err && err.response && setErrors(err.response.data)
                setIsLoading(false)
            })
    }

    const onCloseAlert = () => {
        setErrors(null)
      }
    return (
        <>
        {
            errors && errors.error && <Alert
              message={errors.error}
              type="error"
              closable
              onClose={onCloseAlert}
              className='my-3'
            />
          }
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
                    label="Email"
                    name="email"
                    className="label mb-3"
                    validateStatus={errors && errors.email ? "error" : "succcess"}
                    help={errors && errors.email ? errors.email : null}

                >
                    <Input placeholder="Enter your email" />
                </Form.Item>




                <div className='g_auth'>
                    <button className="primary_btn my-3" disabled={isLoading} type="primary" htmlType="submit">
                    Get OTP
                        {
                            isLoading && <Spin size='small' style={{ marginLeft: "10px" }} />
                        }

                    </button>


                </div>

            </Form>






            {/* <form onSubmit={handleSubmit}  className="form_fild login_form">
            {
                errors && errors.error &&  <Alert style={{marginBottom:"10px"}} message={errors.error} type="error" />
            }
            <div className={`field email ${errors?.email ? "error shake" : ""}`}>
                <div className="input-area">
                    <input onChange={e=>setEmail(e.target.value)} value={email} name='email' type="text" placeholder="Email address" />
                    <i className="icon fas fa-envelope"></i>
                    <i className="error error-icon fas fa-exclamation-circle"></i>
                </div>
                {errors?.email && <div className="error error-txt">{errors.email}</div>}

            </div>
           
            <button disabled={isLoading} className='submit_button' >Get OTP {isLoading && <Spin className='spin'/>}</button>

        </form> */}
        </>
    )
}

export default Forgot
