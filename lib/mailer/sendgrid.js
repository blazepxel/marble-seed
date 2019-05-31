const sgMail = require('@sendgrid/mail')

class ProviderSendGrid {
  constructor (settings) {
    this.settings = settings
  }

  sendEmail (conf) {
    sgMail.setApiKey(this.settings.emailKey)

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
