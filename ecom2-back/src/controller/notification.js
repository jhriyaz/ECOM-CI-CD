const Notification = require('../models/notification')
const mongoose = require('mongoose')

exports.myNotifications = (req, res) => {
    // #swagger.tags = ['Notification']
    // #swagger.summary = 'My notifications'
    Notification.find({ userTo: req.user._id })
        .sort('-createdAt')
        .limit(10)
        .then(notifications => {
            res.status(200).json({ success: true, notifications })
        })
        .catch(err => {
            res.status(400).json({ error: "something went wrong" })
        })
}

exports.notificationMarkRead = (req, res) => {
    // #swagger.tags = ['Notification']
    // #swagger.summary = 'Mark read notification'
    let notId = req.params.id
    if (!mongoose.isValidObjectId(notId)) {
        return res.status(400).json({ error: "Invalid notification id" })
    }

    Notification.findByIdAndUpdate(notId, { $set: { opened: true } }, { new: true })
        .then(noti => {
            res.status(200).json({ notification: noti })
        })
        .catch(err => {
            res.status(400).json({ error: "something went wrong" })
        })
}