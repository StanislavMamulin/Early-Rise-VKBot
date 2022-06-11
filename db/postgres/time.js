const { getModel } = require('./models/EarlyBird')

const addTime = async (userID, date, isRiseTime) => {
    const timeType = isRiseTime ? 'riseTime' : 'sleepTime'

    try {

    } catch (err) {
        console.error(err)
    }
}

const getLastActionTime = async userID => {
    try {

    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastSleepTime = async userID => {
    try {

    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastSleepTimeForDays = async (userID, days) => {
    try {

    } catch (err) {
        console.error(err)
        return []
    }
}

const getLastWakeUpTime = async userID => {
    try {

    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastWakeUpTimeForDays = async (userID, days) => {
    try {

    } catch (err) {
        console.error(err)
        return []
    }
}

module.exports = {
    addTime,
    getLastActionTime,
    getLastSleepTime,
    getLastSleepTimeForDays,
    getLastWakeUpTime,
    getLastWakeUpTimeForDays,
}
