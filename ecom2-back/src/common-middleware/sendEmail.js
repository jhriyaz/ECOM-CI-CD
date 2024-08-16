
const nodemailer = require('nodemailer')
const { otp,email } = require('../../secretDb.json')

let smtp = otp.clients.smtp

let sendgrid = email.sendgrid

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid.apiKey);

var smtpTransport =nodemailer.createTransport({
    name:smtp.host||"",
    host: smtp.host||"",
    port: smtp.port||587,
    secure:smtp.secure||false,
    auth: {
      user: smtp.username||"",
      pass: smtp.password||""
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

exports.sendEmail=async(email,subject,text)=>{
  //   var mailOptions = {
  //       from: smtp.mail,
  //       to: email,
  //       subject,
  //       text
  //     }
  //  return new Promise((resolve,reject)=>{
  //   smtpTransport.sendMail(mailOptions, function (error, response) {
  //       if(error){
  //           reject({success:false})
  //       }else{
  //           resolve({success:true})
  //       }
  //   })
  //  })


  const msg = {
    to: email,
    from: sendgrid.senderEmail,
    subject: subject,
    html:text,
  }


  return new Promise((resolve, reject) => {
    sgMail
      .send(msg)
      .then(() => {
        resolve({ success: true })
      }, error => {
        console.error(error);

        if (error.response) {
          reject({ success: false })
          console.error(error.response.body)
        } else {
          resolve({ success: true })
        }
      });
  })

}