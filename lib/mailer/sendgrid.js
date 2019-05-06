'use strict'
const config = require('config/mailer')
const sgMail = require('@sendgrid/mail')

class ProviderSendGrid {
  constructor (conf) {
    this.conf = conf
  }

  sendEmail (conf) {
    sgMail.setApiKey(this.conf.emailKey)

    if (!config.active) {
      console.log(`Email not send, body => \n ${conf.body} \n`)
    }
    let recipient

    if (conf.recipient) {
      recipient = [{
        email: conf.recipient.email,
        name: conf.recipient.name
      }]
    } else {
      recipient = conf.recipients
    }
    const msg = {
      to: recipient,
      from: conf.sender.email,
      subject: conf.title,
      html: conf.body
    }
    return sgMail.send(msg)
  }
}

module.exports = ProviderSendGrid
