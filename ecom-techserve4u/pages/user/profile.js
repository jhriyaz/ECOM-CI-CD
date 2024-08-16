import React, { useState, useEffect } from 'react'
import Navbar from '../../components/header/Header'
import BasicInformation from '../../components/profile/BasicInformation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import Address from '../../components/profile/Address'
import { CloudUploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { notificationFunc } from '../../components/global/notification'
import { Spin } from 'antd';
import OrderList from '../../components/profile/OrderList'
import Password from '../../components/profile/Password'
function profile() {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const Router = useRouter()
    const [imageLoading, setImageLoading] = useState(false)

    const [tab, setTab] = useState('basic')
    useEffect(() => {
        if (Object.keys(Router.query).length > 0) {
            setTab(Router.query.tab)
        } else {
            setTab('basic')
        }
    }, [Router])
    //pofilePicture


    const handleUploadImage = (image) => {
        if (image) {
            setImageLoading(true)
            let formData = new FormData()
            formData.append("profile", image)
            axios.patch('/user/profileimage', formData)
                .then(res => {

                    dispatch({
                        type: "SET_USER",
                        payload: res.data.user
                    })
                    setImageLoading(false)
                    notificationFunc("success", "Profile updated")

                })
                .catch(err => {
                    setImageLoading(false)
                    //console.log(err);
                })
        }
    }
    return (
        <>
            <Navbar />
            <div id="profile">
                <div className="main_container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12">
                            <div className="profile_navigation">
                                <div className="profile_info">
                                    <div className="profile_img">
                                        <img src={user?.profilePicture ? user.profilePicture : "https://via.placeholder.com/150"} alt="" />
                                        <label htmlFor="profile_img">
                                            {
                                                imageLoading ? <Spin className='upload_icon' /> : <CloudUploadOutlined className='upload_icon' />
                                            }

                                            <input disabled={imageLoading} onChange={(e) => handleUploadImage(e.target.files[0])} hidden type="file" name="profile_img" id="profile_img" />
                                        </label>

                                    </div>

                                    <h5 className="user_name text-capitalize">{user && user.name}</h5>
                                    <p>{user && user.mobile}</p>
                                </div>
                                <div className="profile_nav">
                                    <ul>
                                        <li className={`${tab === 'basic' && "active_nav_link"}`}>
                                            <Link href="/user/profile?tab=basic">
                                                <i className="far fa-user"></i>Basic Information
                                            </Link>
                                        </li>
                                        <li className={`${tab === 'address' && "active_nav_link"}`}>
                                            <Link href="/user/profile?tab=address">
                                                <i className="fas fa-map-marker-alt"></i>Address
                                            </Link>
                                        </li>
                                        <li className={`${tab === 'orders' && "active_nav_link"}`}>
                                            <Link href="/user/profile?tab=orders">
                                                <i className="fas fa-list"></i>Order List
                                            </Link>
                                        </li>
                                        <li className={`${tab === 'review' && "active_nav_link"}`}>
                                            <Link href="/user/profile?tab=review">
                                                <i className="fas fa-user-clock"></i>Review
                                            </Link>
                                        </li>
                                        <li className={`${tab === 'password' && "active_nav_link"}`}>
                                            <Link href="/user/profile?tab=password">
                                                <i className="fas fa-key"></i>Change Password
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-9 col-md-12">
                            <div className="details_container">
                                {
                                    tab === 'basic' && <BasicInformation />
                                }
                                {
                                    tab === 'address' && <Address />
                                }
                                {
                                    tab === 'orders' && <OrderList />
                                }
                                {
                                    tab === 'password' && <Password />
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default profile
