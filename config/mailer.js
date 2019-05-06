module.exports = {
  active: process.env.EMAIL_SEND === 'true',
  emailProvider: process.env.EMAIL_PROVIDER,
  emailKey: process.env.EMAIL_KEY,
  sender: {
    email: process.env.EMAIL_FROM,
    name: 'Marble seeds app'
  }
}
