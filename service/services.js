const schedule = require('node-schedule')
const { clearAllUsersScore } = require('../db/score')
const { deleteMessagesInTheLastMonth } = require('../vk/dataManager')

const clearScoreSchedule = () => {
    const firstDayOfEveryMonth = '1 0 1 * *'

    schedule.scheduleJob(firstDayOfEveryMonth, () => {
        clearAllUsersScore()
        deleteMessagesInTheLastMonth()
    })
}

module.exports = {
    clearScoreSchedule,
}
