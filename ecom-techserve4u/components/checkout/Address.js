import React, { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import AddressModal from "../adressModal/AddressModal";
import axios from "axios";
import Link from 'next/link'
import { notification, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AiFillDelete } from 'react-icons/ai';
import { fetchAddresses } from "../../actions/generalActions";
import { useDispatch } from "react-redux";

function Address({ onStepChange, selectedAddress, setSelectedAddress, addresses }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = (id) => {
        axios.delete('/address/delete/'+id)
        .then(res => {
            console.log('res', res);
            dispatch(fetchAddresses());
            notification.success({ message: 'Address Deleted Successfully' })
        })
        .catch(error => {
            console.log('error', error);
            notification.error({ message: 'Something went wrong!' })
        })
    }



    return (
        <>
            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}

            />
            <h5 className="heading">Your Address</h5>
            <form onChange={setSelectedAddress}>
                <div className="address_wrapper">

                    {addresses.map((address, index) => {
                        return (
                            <label key={index} className={`address-megabox d-block bg-white ${selectedAddress && selectedAddress === address._id && "active"}`}>
                                <input checked={selectedAddress === address._id} type="radio" name="address_id" value={address._id} required="" />
                                <span className="d-flex p-3 address-megabox-elem">
                                    <span className="aiz-rounded-check flex-shrink-0 mt-1"></span>
                                    <span className="flex-grow-1 pl-3">
                                        <div>
                                            <span className="alpha-6">Name:</span>
                                            <span className="strong-600 ml-2">{address.name}</span>
                                        </div>
                                        <div>
                                            <span className="alpha-6">Mobile:</span>
                                            <span className="strong-600 ml-2">{address.mobileNumber}</span>
                                        </div>
                                        <div>
                                            <span className="alpha-6">State:</span>
                                            <span className="strong-600 ml-2">{address.state}</span>
                                        </div>
                                        <div>
                                            <span className="alpha-6">City:</span>
                                            <span className="strong-600 ml-2">{address.city}</span>
                                        </div>
                                        <div>
                                            <span className="alpha-6">Zip:</span>
                                            <span className="strong-600 ml-2">{address.zip}</span>
                                        </div>
                                        <div>
                                            <span className="alpha-6">Address:</span>
                                            <span className="strong-600 ml-2">{address.address}</span>
                                        </div>
                                    </span>
                                </span>

                                <Popconfirm
                                    title="Are you sure to delete this Address?"
                                    onConfirm={() => handleDelete(address._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <span style={{ cursor: "pointer" }}><AiFillDelete size={24} style={{ color: "red" }} /></span>
                                </Popconfirm>

                            </label>
                        );
                    })}

                    <div onClick={() => showModal()} className="add_new">
                        <IoAdd className="add_icon" />
                        <span>Add New Address</span>
                    </div>
                </div>
            </form>
            <div className='d-flex justify-content-between my-3 mt-5'>
                <button onClick={() => onStepChange(-1)} className='primary_outline_btn'>Back</button>
                <button onClick={() => onStepChange(1)} className='primary_btn'>Continue to Payment</button>
            </div>
        </>
    );
}

export default Address;
