const VKBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup')
const config = require('config')
const { incomingMessage, groupJoin, showLeaderboard } = require('./bot/responses')
const { connect } = require('./db/db')
const { getLeadersString, getMenuText } = require('./bot/responseText')
const { sendChart } = require('./chart/chart')
const { clearScoreSchedule } = require('./service/services')
const { getStepTopicURL } = require('./vk/dataManager')

const bot = new VKBot({
    token: config.get('VK.adminToken'),
    group_id: config.get('VK.groupID'),
})

async function start() {
    try {
        await connect()
        clearScoreSchedule()
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
    try {
        const topList = await showLeaderboard(topCount)
        return getLeadersString(topList)
    } catch (err) {
        console.error(err)
        return ''
    }
}

bot.command('Рейтинг', async ctx => {
    const topCount = 20
    try {
        await ctx.reply(await leadersString(topCount))
    } catch (err) {
        console.error(err)
    }
})

bot.command('Общий рейтинг', async ctx => {
    const topCount = 20
    try {
        await ctx.reply(await leadersString(topCount))
    } catch (err) {
        console.error(err)
    }
})

bot.command('Мой режим', async ctx => {
    const { from_id: userID } = ctx.message
    try {
        await sendChart(userID)
    } catch (err) {
        console.error(err)
    }
})

bot.command('Меню', async ctx => {
    const stepTopicURL = getStepTopicURL()
    try {
        await ctx.reply(getMenuText(), null, Markup
            .keyboard([
                Markup.button('Рейтинг', 'primary'),
                Markup.button('Мой режим', 'primary'),
                Markup.button({
                    action: {
                        type: 'open_link',
                        link: stepTopicURL,
                        label: 'Запись шагов',
                        payload: JSON.stringify({
                            url: stepTopicURL,
                        }),
                    },
                })
            ], { columns: 2 }))
    } catch (err) {
        console.error(err)
    }
})

bot.startPolling(err => {
    if (err) {
        console.error(err)
        bot.stop()
    }
})
