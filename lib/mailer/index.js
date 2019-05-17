const nunjucks = require('nunjucks')
const inlineCss = require('inline-css')
const path = require('path')
const fs = require('fs-extra')
const config = require('config/mailer')
const emailProviders = require('./providers')

const render = function (template, data, isString) {
  return new Promise(function (resolve, reject) {
    if (isString) {
      nunjucks.renderString(template, data, function (err, res) {
        if (err) { return reject(err) }
        resolve(res)
      })
    } else {
      nunjucks.render(template, data, function (err, res) {
        if (err) { return reject(err) }

        resolve(res)
      })
    }
  })
}

const inline = function (html) {
  // Load a css file
  return inlineCss(html, { url: 'file://' })
}

module.exports = class Mail {
  constructor (template, isString) {
    this.template = template
    this.isString = isString
  }

  getProvider () {
    let emailProvider
    if (!config.active) {
      throw new Error('Email not active!')
    } else if (config.active && !emailProviders.hasOwnProperty(config.emailProvider)) {
      throw new Error('Email provider is not configured!')
    } else {
      const EmailProvider = emailProviders[config.emailProvider]
      emailProvider = new EmailProvider(config)
    }
    return emailProvider
  }

  async format (data) {
    let template
    if (this.isString) {
      template = this.template
    } else {
      template = path.join('./api/email-templates', this.template + '.html')
    }

    const body = await render(template, data, this.isString)
    this.body = await inline(body)
  }

  async send (options) {
    let emailProvider = this.getProvider()
    options = options || {}
    if (!options.sender) { options.sender = config.sender }

    let response = await emailProvider.sendEmail({
      body: this.body,
      title: options.title,
      recipient: options.recipient,
      recipients: options.recipients,
      sender: options.sender
    })

    return response
  }
}
