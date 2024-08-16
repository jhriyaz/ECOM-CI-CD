import React,{useState} from 'react'
import axios from 'axios'
import GoogleLogin from 'react-google-login';
import SetPassword from './SetPassword';
import Cookies from "js-cookie";
import { notificationFunc } from '../global/notification'

function GoogleAuth({from}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tokenId, setTokenId] = useState(null);
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passError, setPassError] = useState(null)

    const handleCancel = () => {
        setIsModalVisible(false)
        setTokenId(null)
        setPassError(null)
    }
    const handleSavePass = () => {
        let data = {
            password,
            confirmPassword,
            tokenId
        }
        axios.patch("/user/setpassandcreate", data)
            .then(res => {
                Cookies.set("myshop_auth2", res.data.token);
                notificationFunc("success", "Registered successfully")
                handleCancel()
                setTimeout(() => {
                    window.location.pathname = '/'
                }, 3000);
            })
            .catch(err => {
                err && err.response && setPassError(err.response.data)
            })
    }
    
    const responseGoogle = (data) => {
        axios.post('/user/googleauth', { tokenId: data.tokenId })
            .then(res => {
                if (res.data.requiredPassword) {
                    setIsModalVisible(true)
                    setTokenId(res.data.tokenId)
                } else {
                    Cookies.set("myshop_auth2", res.data.token);
                    notificationFunc("success", "Logged in successfully")
                    setTimeout(() => {
                        window.location.pathname = '/'
                    }, 3000);
                }
            })
    }
    return (
        <>
            <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                render={renderProps => (
                        <div onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-btn">
                        <div className="google-icon-wrapper">
                            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                        </div>
                           <p className="btn-text"><b>Sign in with google</b></p>
                    </div>
                    
                    
                )}
                onSuccess={responseGoogle}
                onFailure={(err) => console.log(err)}
                cookiePolicy={'single_host_origin'}
            />
            <SetPassword
                handleSavePass={() => handleSavePass()}
                isModalVisible={isModalVisible}
                handleCancel={() => handleCancel()}
                onchangePassword={e => setPassword(e.target.value)}
                onchangeConfirmPassword={e => setConfirmPassword(e.target.value)}
                password={password}
                confirmPassword={confirmPassword}
                error={passError}
            />
        </>
    )
}

export default GoogleAuth
