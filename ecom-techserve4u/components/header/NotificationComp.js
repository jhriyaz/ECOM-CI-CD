import React from 'react'
import { Menu, Dropdown, List, Avatar,Badge } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import {useRouter} from 'next/router'

function NotificationList() {
  const Router = useRouter()
  const dispatch = useDispatch()
  const { categories, notifications } = useSelector(state => state.general)

  const generateNotificationUrl = (type, entityId) => {
    let url = ""
    if (type === "order") {
      url = `/orders?invoice_no=${entityId}`
    }
    return url
  }

  const notificationMarkRead = (noti) => {
    if (noti.opened) {
      return Router.push(generateNotificationUrl(noti.notificationType, noti.entityId))
    }
    axios.patch(`/notification/markread/${noti._id}`)
      .then(res => {
        dispatch({
          type: "UPDATE_NOTIFICATION",
          payload: res.data.notification
        })
        //console.log(res.data.notification);
        Router.push(generateNotificationUrl(noti.notificationType, noti.entityId))
      })
      .catch(err => {
        console.log(err);
      })
  }

  const notificationLists = (
    <List
      // header={<p>Messages</p>}
      // className="notification_list"
      style={{ backgroundColor: '#F7F8FA', width: '400px', borderRadius: '7px' }}
      
      size="large"
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={noti => (
        <List.Item onClick={() => notificationMarkRead(noti)} className={!noti.opened ? "unread" : ""} style={{ cursor: "pointer" }}>
          <List.Item.Meta
            avatar={<Avatar style={{background:"#28A745"}}>DCEL</Avatar>}
            title={<span >{noti.text}</span>}
            description={moment(noti.createdAt).fromNow()}
          />

        </List.Item>
      )}
    />
    
  );

  return (
    <>
      <Dropdown overlay={notificationLists} trigger={['click']} placement="bottomRight">
        <Badge count={notifications && notifications.filter(noti => !noti.opened).length} >
          <span><i className="far fa-bell"></i></span>
        </Badge>
      </Dropdown>
    </>
  )
}

export default NotificationList
