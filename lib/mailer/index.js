'use strict'
const nunjucks = require('nunjucks')
const inlineCss = require('inline-css')
const path = require('path')
const fs = require('fs-extra')
const config = require('config/mailer')
const Mandrill = require('./mandrill')
const SendGrid = require('./sendgrid')

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

if (!config.active) {
  console.warn('Emails will not be sent!!')
}

let provider

if (config.emailProvider === 'mandrill') {
  provider = new Mandrill(config)
} else if (config.emailProvider === 'sendgrid') {
  provider = new SendGrid(config)
} else {
  console.log('Email provider not found. You can define it on your env file.')
}

module.exports = class Mail {
  constructor (template, isString) {
    this.template = template
    this.isString = isString
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
    options = options || {}
    if (!options.sender) { options.sender = config.sender }

    let response = await provider.sendEmail({
      body: this.body,
      title: options.title,
      recipient: options.recipient,
      recipients: options.recipients,
      sender: options.sender
    })

    return response
  }
}
