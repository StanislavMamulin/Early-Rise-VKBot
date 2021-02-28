const schedule = require('node-schedule')
const { clearScore } = require('../db/score')
const { deleteMessagesInTheLastMonth } = require('../vk/dataManager')

const clearScoreSchedule = () => {
    const firstDayOfEveryMonth = '1 0 1 * *'

    schedule.scheduleJob(firstDayOfEveryMonth, () => {
        clearScore()
        deleteMessagesInTheLastMonth()
    })
}

module.exports = {
    clearScoreSchedule,
}
