'use strict'
const config = require('config/mailer')
const mandrill = require('mandrill-api/mandrill')

class ProviderMandrill {
  constructor (conf) {
    this.conf = conf
  }

  sendEmail (conf) {
    const client = new mandrill.Mandrill(this.conf.emailKey)
    var q = new Promise(function (resolve, reject) {
      var message = {
        from_email: conf.sender.email,
        from_name: conf.sender.name
      }

      if (!config.active) {
        console.log(`Email not send, body => \n ${conf.body} \n`)
        return resolve()
      }

      message.html = conf.body
      message.subject = conf.title
      if (conf.recipient) {
        message.to = [{
          email: conf.recipient.email,
          name: conf.recipient.name
        }]
      } else {
        message.to = conf.recipients
      }

      if (!config.active) {
        console.log(`Email not send, body => \n ${conf.body} \n`)
        return resolve()
      }

      client.messages.send({
        'message': message,
        'async': false,
        'ip_pool': 'Main pool'
      }, function (result) {
        resolve(result)
      }, function (err) {
        reject(err)
      })
    })

    return q
  }
}

module.exports = ProviderMandrill
