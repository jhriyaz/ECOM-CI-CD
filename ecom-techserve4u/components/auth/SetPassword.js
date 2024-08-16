import React from 'react'
import {Modal,Input,Alert} from 'antd'

function SetPassword({ isModalVisible, handleSavePass, handleCancel,onchangePassword ,onchangeConfirmPassword,password,confirmPassword,error}) {
    return (
        <>
            <Modal zIndex={1111} title="Set Password" visible={isModalVisible} onOk={handleSavePass} onCancel={handleCancel}>
            <div className='mb-3'>
                    {
                        error && error.message && <Alert
                            message={error.message}
                            type="error"
                        />
                    }
                </div>
                <Input value={password} onChange={onchangePassword} type='password' style={{marginBottom:"10px"}} placeholder='New password'></Input>
                <Input value={confirmPassword} onChange={onchangeConfirmPassword} type='password' placeholder='Confirm password'></Input>
            </Modal>
        </>
    )
}

export default SetPassword
