const axios = require('axios')
const moment = require('moment')
const config = require('../../config/config.js')

async function sendAlert (transaction) {
  const title = `Transação ${transaction.description} atrasada!`

  const body = {
    text: title,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${title}*`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Date*\n' + moment(transaction.date).format('DD/MM/YYYY')
          },
          {
            type: 'mrkdwn',
            text: '*Description*\n' + transaction.description
          },
          {
            type: 'mrkdwn',
            text: '*Type*\n' + transaction.type
          },
          {
            type: 'mrkdwn',
            text: '*Amount*\n' + transaction.amount
          },
          {
            type: 'mrkdwn',
            text: '*Category*\n' + transaction.category
          },
          {
            type: 'mrkdwn',
            text: '*Method*\n' + transaction.method
          }
        ]
      },
      {
        type: 'divider'
      }
    ]
  }

  const options = {
    method: 'post',
    url: config.slack.URL,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    json: true
  }

  const res = await axios(options)

  if (res.status === 200) {
    return true
  } else {
    throw res
  }
}

module.exports = { sendAlert }
