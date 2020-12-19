const VKBot = require('node-vk-bot-api')
const config = require('config')
const { incomingMessage } = require('./bot/responses')
const { connect } = require('./db/db')

const bot = new VKBot({
    token: process.env.TOKEN,
    group_id: config.get('VK.groupID'),
})

async function start() {
    try {
        await connect()
    } catch (err) {
        console.log(err)
    }
}

start()

bot.event('board_post_new', ctx => {
    try {
        incomingMessage(ctx.message)
    } catch (err) {
        console.log('Error in post_new:\n', err)
    }
})

bot.startPolling(err => {
    if (err) {
        console.error(err)
        bot.stop()
    }
})
