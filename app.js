const VKBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup')
const config = require('config')
const { incomingMessage, groupJoin, showLeaderboard } = require('./bot/responses')
const { connect } = require('./db/db')
const { getLeadersString } = require('./bot/responseText')

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

bot.event('group_join', ctx => {
    try {
        groupJoin(ctx.message)
    } catch (err) {
        console.log('Error in post_new:\n', err)
    }
})

const leadersString = async topCount => {
    const topList = await showLeaderboard(topCount)
    return getLeadersString(topList)
}

bot.command('Рейтинг', async ctx => {
    const topCount = 20
    ctx.reply(await leadersString(topCount), null, Markup
        .keyboard([
            Markup.button('Общий рейтинг', 'positive')
        ]))
})

bot.command('Общий рейтинг', async ctx => {
    const topCount = 20
    ctx.reply(await leadersString(topCount))
})

bot.startPolling(err => {
    if (err) {
        console.error(err)
        bot.stop()
    }
})
