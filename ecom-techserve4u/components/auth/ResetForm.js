import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { message, Alert, Spin, Button, Form, Input } from 'antd'
import passwordValidator from 'password-validator'
import { notificationFunc } from '../global/notification'
const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(6)
    .is().max(100)
    .has().not().spaces()


function ResetForm({ email }) {
    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false)



    const resetValidator = (otp, password, confirm) => {
        let error = {}
        if (!otp) {
            error.otp = 'Please enter your OTP code'
        }


        if (!password) {
            error.password = "Enter your password"
        } else if (!schema.validate(password)) {
            //console.log(schema.validate(password, { list: true }));
            let errors = schema.validate(password, { list: true })

            let errorTexts = []
            errors.map((error) => {
                error === 'min' && errorTexts.push("minimum 6 digit")
            })

            error.password = "Password should be " + errorTexts.join(",")
        }
        if (!confirm) {
            error.confirm = "Please enter confirm password"
        } else if (password !== confirm) {
            error.confirm = "Password didn't matched"
        }

        return {
            error,
            isError: Object.keys(error).length == 0
        }
    }





    const onFinish = (values) => {
        
        const validate = resetValidator(values.otp, values.password, values.confirm)

        if (!validate.isError) {
            return setErrors(validate.error)
        }
        setErrors(null)
        setIsLoading(true)
        axios.patch('/user/resetPassword/', { email, otp: values.otp, password: values.password })
            .then(res => {
                if (res.data.success) {
                    notificationFunc("success", "Password changed successfully")
                    window.location.pathname = '/auth/login'
                }
                setIsLoading(false)
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

    const onCloseAlert = () => {
        setErrors(null)
      }
    return (
        <>

            <div className='mb-3'>
                {
                    errors && errors.error && <Alert
                        message={errors.error}
                        type="error"
                        closable
                        onClose={onCloseAlert}
                    />
                }
            </div>
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
                    label="OTP"
                    name="otp"
                    className="label mb-3"
                    validateStatus={errors && errors.otp ? "error" : "succcess"}
                    help={errors && errors.otp ? errors.otp : null}

                >
                    <Input placeholder="Enter your 6 digit otp" />
                </Form.Item>

                <Form.Item
                    label="New password"
                    name="password"
                    className="label"
                    validateStatus={errors && errors.password ? "error" : "succcess"}
                    help={errors && errors.password ? errors.password : null}
                >
                    <Input.Password placeholder='Enter new password' />
                </Form.Item>


                <Form.Item
                    label="Confirm password"
                    name="confirm"
                    className="label"
                    validateStatus={errors && errors.confirm ? "error" : "succcess"}
                    help={errors && errors.confirm ? errors.confirm : null}
                >
                    <Input.Password placeholder='Enter your confirm password' />
                </Form.Item>



                <div className='g_auth'>
                    <button className="primary_btn my-3" disabled={isLoading} type="primary" htmlType="submit">
                        Reset
                        {
                            isLoading && <Spin size='small' style={{ marginLeft: "10px" }} />
                        }

                    </button>

                </div>

            </Form>

        </>
    )
}

export default ResetForm
