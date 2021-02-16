const schedule = require('node-schedule')
const { clearScore } = require('../db/score')

const clearScoreSchedule = () => {
    const when = '10 0 1 * *'
    // const when = new Date(2021, 0, 31, 21, 1)

    schedule.scheduleJob(when, () => {
        clearScore()
    })
}

module.exports = {
    clearScoreSchedule,
}
