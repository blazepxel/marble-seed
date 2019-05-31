const mandrill = require('mandrill-api/mandrill')

class ProviderMandrill {
  constructor (settings) {
    this.settings = settings
  }

  sendEmail (conf) {
    const client = new mandrill.Mandrill(this.settings.emailKey)
    var q = new Promise(function (resolve, reject) {
      var message = {
        from_email: conf.sender.email,
        from_name: conf.sender.name
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

      client.messages.send({
        'message': message,
        'async': false,
        'ip_pool': 'Main pool'
      }, resolve, reject)
    })

    return q
  }
}

module.exports = ProviderMandrill
