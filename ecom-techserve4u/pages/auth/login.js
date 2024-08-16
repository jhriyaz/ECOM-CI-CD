import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'antd';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import Header from '../../components/header/Header';
import Cookies from "js-cookie";
import Link from 'next/link'
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


const Login = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const onFinish = (values) => {
    setLoading(true)
    axios.post('/user/signin', values)
      .then(res => {
        if (res.status === 200) {
          Cookies.set("myshop_auth2", res.data.token);
          notificationFunc("success", "login success")
          setLoading(false)
          setTimeout(() => {
            window.location.pathname = '/'
          }, 1000);

        }
      })
      .catch(err => {
        setError(err && err.response && err.response.data);
        setLoading(false)
      })

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onCloseAlert = () => {
    setError(null)
  }

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
            validateStatus={error && error.email ? "error" : "succcess"}
            help={error && error.email ? error.email : null}

          >
            <Input placeholder="Enter your email" />
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



          <div className='g_auth'>
            <button className="primary_btn my-3" disabled={loading} type="primary" htmlType="submit">
              Login
              {
                loading && <Spin size='small' style={{ marginLeft: "10px" }} />
              }

            </button>
            <div className='g_auth'>
              <GoogleAuth />
            </div>
            <span className='register'> Dont't have an account ? <Link href="/auth/register">register now!</Link></span>
            <span className='register'>Forgot your password ? <Link href="/auth/forgot-password">Reset now!</Link></span>
          </div>

        </Form>
      </div>
    </>
  );
};

export default Login
