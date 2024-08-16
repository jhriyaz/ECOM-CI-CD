import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import { notificationFunc } from '../global/notification'


function Password() {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleChangePass=()=>{
        let data={
            currentPassword,
            newPassword,
            confirmPassword
        }
        axios.patch("/user/changePassword",data)
        .then(res=>{
            notificationFunc("success", res.data.message)
        })
        .catch(err=>{
            err && err.response && notificationFunc("error", err.response.data.error)
        })
    }

  
    return (
        <>
            <div className='mb-5'>
                <div className="section_heading">
                    <span><i className="fas fa-file-alt"></i></span>

                    <div className='heading_title'>

                        <h5>Change Password</h5>
                       

                    </div>

                </div>
                <div className="section_content">
                    <div className="single_item">
                        <span className="key">Current Password:</span>
                        <input onChange={(e)=>setCurrentPassword(e.target.value)} value={currentPassword} className="value"></input>
                    </div>
                    <div className="single_item">
                        <span className="key">New Password:</span>
                        <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} className="value"></input>
                    </div>
                    <div className="single_item">
                        <span className="key">Confirm New Password:</span>
                        <input onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} className="value"></input>
                    </div>
                    <button onClick={()=>handleChangePass()} className="primary_btn">Save</button>
                </div>

              
            </div>


        </>
    )
}

export default Password
