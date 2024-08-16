import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import { notificationFunc } from '../global/notification'
import PhoneInput from 'react-phone-input-2'
import ReactPhoneInput from 'react-phone-input-2'
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
// import 'react-phone-input-2/lib/style.css'

import 'react-phone-input-2/lib/material.css'
// import "react-phone-input-2/dist/style.css";


function BasicInformation() {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [mobile, setMobile] = useState('')
    const [name, setName] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [gender, setGender] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [email, setEmail] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [isEditEmail, setIsEditEmail] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const reset = () => {
        if (user) {

            setMobile(user.mobile)
            setName(user.name)
            setContactNumber(user.contactNumber || '')
            setGender(user.gender)
            setBirthDate(user.birthDate || '')
            setEmail(user.email || '')
            setCreatedAt(user.createdAt)
        }
    }
    useEffect(() => {
        reset()
    }, [user])

    const saveGeneralInfo = () => {
        let data = {
            mobile,
            name,
            contactNumber,
            gender: gender === 'N/A' ? "" : gender,
            birthDate
        }

        if(phoneError.length === 0) {
            axios.patch('/user/update', data)
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type: "SET_USER",
                        payload: res.data.user
                    })
                    setIsEdit(false)
                    notificationFunc("success", "Profile updated")
                }
            })
            .catch(err => {
                err && err.response && notificationFunc("error", err.response.data.error)
            })
        } else {
            
            notificationFunc("error", "Phone must be USA/Canada")
        }
    }
    const saveEmail = () => {
        if (!email) {
            return notificationFunc("error", "Please enter your email")
        }
        let data = {
            email
        }
        axios.patch('/user/email', data)
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type: "SET_USER",
                        payload: res.data.user
                    })
                    setIsEditEmail(false)
                    notificationFunc("success", "Email updated")
                }
            })
            .catch(err => {
                err && err.response && notificationFunc("error", err.response.data.error)
            })
    }


    function generate18YearBefore() {
        let currentDate = new Date();
        const year = currentDate.getFullYear() - 18;
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const targetDate = new Date(year, month, day);

        const monthFormat = targetDate.toLocaleDateString();

        // convert from 6/1/2005 to 2005/01/06

        const parts = monthFormat.split("/");

        //.slice(-2) method in JavaScript is used to extract the last two characters from a string
        const convertedDate = parts[2] + '-' + ('0' + parts[0]).slice(-2) + '-' + ('0' + parts[1]).slice(-2);

        return convertedDate;

    }

    // let day = objectDate.getDate();
    // let month = objectDate.getMonth();
    // month +=1;
    // let year = objectDate.getFullYear();

    // if (month < 10)
    //     month = '0' + month.toString();
    // if (day < 10)
    //     day = '0' + day.toString();

    // let fromToday = year.toString() + "-" + month + "-" + day;

    useEffect(() => {
        if(contactNumber == 1) {
            setPhoneError('')
        }
    }, [contactNumber])

    const setPhoneValidation = () => {
        let numberArr = contactNumber.split('');
        const parsed = parseInt(numberArr[0])
        if (parsed !== 1) {
            setPhoneError("Number should have prefix 1")
        } else {
            setPhoneError('');
        }
    }

    return (
        <>
            <div className='mb-5'>
                <div className="section_heading">
                    <span><i className="fas fa-file-alt"></i></span>

                    <div className='heading_title'>

                        <h5>PERSONAL INFORMATION</h5>
                        {
                            !isEdit && <button onClick={() => setIsEdit(true)}>Edit</button>
                        }

                    </div>

                </div>
                <div className="section_content">
                    {/* <div className="single_item">
                        <span className="key">Mobile Number:</span>
                        <PhoneInput
                            country={'us'}
                            onlyCountries={["us", "ca"]}
                            disabled={!isEdit}
                            value={mobile}
                            className="value"
                            inputStyle={{ border: "1px solid #ddd", height: '10px', width: "100%", backgroundColor: '#e0e0e0' }}
                            onChange={mobile => setMobile(mobile)}
                            specialLabel={false}
                        />
                    </div> */}
                    <div className="single_item">
                        <span className="key">Name:</span>
                        <input onChange={(e) => setName(e.target.value)} disabled={!isEdit} value={name} className="value"></input>
                    </div>
                    {/* <div className="single_item">
                                        <span className="key">Last Name:</span>
                                        <span className="value">Alam</span>
                                    </div> */}
                    <div className="section_content_phone">
                        <span className="key">Contact Number:</span>
                        {/* <input placeholder='Your contact number' onChange={(e) => setContactNumber(e.target.value)} disabled={!isEdit} value={contactNumber && contactNumber} className="value"></input> */}

                        <div>
                            <PhoneInput
                                country={'us'}
                                onlyCountries={["us", "ca"]}
                                disabled={!isEdit}
                                // placeholder="Enter phone number"
                                value={contactNumber}
                                className="value"
                                // countryCodeEditable={false}
                                inputStyle={{ border: "1px solid #ddd", height: '10px', width: "100%", backgroundColor: '#e0e0e0' }}
                                // onChange={handlePhone}
                                onChange={mobile => {
                                    setContactNumber(mobile);
                                    setPhoneValidation();
                                }}
                                specialLabel={false}
                                disableAreaCodes

                            // onChange={(e) => console.log(e)}
                            />

                            {phoneError.length > 0 && <span style={{ color: 'red' }}>{phoneError}</span>}

                        </div>

                    </div>

                    <div className="single_item">
                        <span className="key">Gender:</span>
                        <select onChange={(e) => setGender(e.target.value)} disabled={!isEdit} value={gender ? gender : "N/A"} className="value w-100">
                            <option value="N/A">Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="single_item">
                        <span className="key">Date Of Birth:</span>
                        {
                            !isEdit ? <input disabled={!isEdit} value={birthDate ? moment(birthDate).format("DD MMM YYYY") : "N/A"} className="value"></input> :
                                <input onChange={(e) => setBirthDate(e.target.value)} type='date' value={birthDate ? birthDate : "N/A"} className="value"
                                    // max='2005-05-01'
                                    max={generate18YearBefore()}
                                ></input>
                        }




                    </div>
                    <div className="single_item">
                        <span className="key">Member Since:</span>
                        <input disabled value={createdAt && moment(createdAt).format("DD MMM YYYY")} className="value"></input>
                    </div>
                    <div className="single_item">
                        <span className="key"></span>
                        {
                            isEdit && <div className="mt-2">
                                <button onClick={() => {
                                    setIsEdit(false)
                                    reset()
                                }} className="primary_outline_btn mr-2">Cancel</button>
                                <button onClick={() => saveGeneralInfo()} className='primary_btn'>Save</button>
                            </div>
                        }

                    </div>
                </div>
            </div>


            <div>
                <div className="section_heading">
                    <span><i className="fas fa-envelope-square"></i></span>

                    <div className='heading_title'>

                        <h5>EMAIL ADDRESS</h5>
                        {/* {
                            !isEditEmail && <button onClick={() => setIsEditEmail(true)}>Edit</button>
                        } */}

                    </div>

                </div>
                <div className="section_content">
                    <div className="single_item">
                        <span className="key">Primary Email:</span>
                        <input onChange={(e) => setEmail(e.target.value)} placeholder='Your email' disabled={true} value={email && email} className="value"></input>
                    </div>
                    {/* <div className="single_item">
                                        <span className="key">Other:</span>
                                        <span className="value">N/A</span>
                                    </div> */}
                    <div className="single_item">
                        <span className="key"></span>
                        {
                            isEditEmail && <div className="mt-2">
                                <button onClick={() => setIsEditEmail(false)} className="primary_outline_btn mr-2">Cancel</button>
                                <button onClick={() => saveEmail()} className='primary_btn'>Save</button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default BasicInformation
