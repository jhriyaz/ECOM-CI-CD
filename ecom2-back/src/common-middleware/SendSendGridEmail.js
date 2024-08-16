const { email } = require('../../secretDb.json')

let sendgrid = email.sendgrid

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid.apiKey);

exports.sendDynamicEmail = async (email, templateId, dynamicTemplateData) => {


  const msg = {
    to: email,
    from: sendgrid.senderEmail,
    templateId,
    dynamicTemplateData,
    // Use the email address or domain you verified above
    // subject: subject,
    // //text: 'and easy to do anywhere, even with Node.js',
    // html: text,
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

exports.sendSendgridEmail = (email, subject, html) => {
  const msg = {
    to: email,
    from: sendgrid.senderEmail,
    subject: subject,
    html,
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