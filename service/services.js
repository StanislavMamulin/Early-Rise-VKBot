const schedule = require('node-schedule')
const { clearScore } = require('../db/score')
// const {  } = require('../bot/time')

const clearScoreSchedule = () => {
    const firstDayOfMonth = '1 0 1 * *'

    schedule.scheduleJob(firstDayOfMonth, () => {
        clearScore()
    })
}

module.exports = {
    clearScoreSchedule,
}
