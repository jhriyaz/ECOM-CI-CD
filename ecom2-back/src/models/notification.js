const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userTo: { type: Schema.Types.ObjectId, ref: 'User' },
    userFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    opened: { type: Boolean, default: false },
    entityId: String,
    text:String,
    notificationType:String
}, { timestamps: true });

NotificationSchema.statics.insertNotification = async (userTo, notificationType, entityId,text) => {
    var data = {
        userTo: userTo,
        notificationType: notificationType,
        entityId: entityId,
        text:text,
    };
    // await Notification.deleteOne(data).catch(error => console.log(error));

    let _noti = new Notification(data)
    let noti = await _noti.save()
    //return await noti.populate('userFrom'," _id username profileimg").execPopulate().catch(error => console.log(error));
    return noti
  
}


var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;