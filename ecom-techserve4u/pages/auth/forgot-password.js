import React, { useState } from 'react'
import Header from '../../components/header/Header';
import Forgot from '../../components/auth/Forgot'
import ResetForm from '../../components/auth/ResetForm'

function forgotPassword() {
    const [active, setActive] = useState('forgot')
    const [email, setEmail] = useState('')

    const setStatus = (val) => {
    
            setActive('reset')
            setEmail(val)
        
    }

    return (
        <>
            <Header />
            <div className="auth">
                <section className="main">
                    <div className="form_wrapper">
                        <div className="tile">

                            <h3 className="login">
                                {
                                    active === 'forgot'?
                                    "Enter your email to get OTP":
                                    "Reset your password"
                                }
                               
                            </h3>
                        </div>

                       



                        <div className="form_wrap">

                            {
                                active === 'forgot' &&
                                <Forgot handleNewPassForm={val=>setStatus(val)} />
                            }
                            {
                                active === 'reset' &&
                                <ResetForm email={email} />
                            }

                            



                        </div>

                    </div>
                </section>
            </div>
        </>

    )
}

export default forgotPassword
