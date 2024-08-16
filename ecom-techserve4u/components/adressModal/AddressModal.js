import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Radio, Select, } from 'antd';
const { Option } = Select;
import axios from 'axios'
import { useDispatch } from 'react-redux'
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

let states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

function AddressModal({ isModalVisible, handleCancel, selectedAddress, sendUpdatedData }) {
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editId, setEditId] = useState(null)

    const save = (values) => {
        setLoading(true)
        axios.post('/address/create', values)
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type: "ADD_NEW_ADDRESSES",
                        payload: res.data.address
                    })
                    form.resetFields();
                    setLoading(false)
                    handleCancel()
                }

            })
            .catch(err => {
                console.log(err);
                setLoading(false)
                err && err.response && setError(err.response.data)
            })
    }

    const update = (id, values) => {
        setLoading(true)
        axios.patch('/address/update/' + id, values)
            .then(res => {
                if (res.data.success) {
                    sendUpdatedData(res.data.address);
                    form.resetFields();
                    setLoading(false)
                    handleCancel()
                }

            })
            .catch(err => {
                console.log(err);
                setLoading(false)
                err && err.response && setError(err.response.data)
            })
    }



    const onCreate = (values) => {
        if (editId) {

            update(editId, values)
        } else {
            save(values)
        }

    }

    useEffect(() => {
        if (selectedAddress) {
            form.setFieldsValue(selectedAddress)
            setEditId(selectedAddress._id)
        } else {
            form.resetFields();
            setEditId(null)
        }
    }, [selectedAddress])


    return (
        <>
            <Modal
                confirmLoading={loading}
                open={isModalVisible}
                title={editId ? "Update Address" : "Add New Address"}
                okText={editId ? "Update" : "Create"}
                cancelText="Cancel"
                onCancel={handleCancel}
                zIndex={1111}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    {...layout}
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                    className='address_modal'
                    autoComplete={false}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        validateStatus={error && error.name ? "error" : "succcess"}
                        help={error && error.name ? error.name : null}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                        validateStatus={error && error.address ? "error" : "succcess"}
                        help={error && error.address ? error.address : null}

                    >
                        <Input.TextArea placeholder="Street address,apt,suite,building,floor,etc." />
                    </Form.Item>

                    <Form.Item
                        name="zip"
                        label="Zip Code"
                        validateStatus={error && error.zip ? "error" : "succcess"}
                        help={error && error.zip ? error.zip : null}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                        validateStatus={error && error.city ? "error" : "succcess"}
                        help={error && error.city ? error.city : null}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="state"
                        label="State"
                        validateStatus={error && error.state ? "error" : "succcess"}
                        help={error && error.state ? error.state : null}
                    >
                        <Select
                            dropdownStyle={{ zIndex: 11111 }}
                            showSearch
                            style={{ width: "100%", zIndex: 5 }}
                            placeholder="Select a state"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            getPopupContainer={node => node.parentNode}
                        >
                            {
                                states.map((state, index) => (
                                    <Option key={index} value={state}>{state}</Option>
                                ))
                            }

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="mobileNumber"
                        label="Mobile number"
                        validateStatus={error && error.mobileNumber ? "error" : "succcess"}
                        help={error && error.mobileNumber ? error.mobileNumber : null}
                    >
                        <Input />
                    </Form.Item>




                </Form>
            </Modal>
        </>
    )
}

export default AddressModal
