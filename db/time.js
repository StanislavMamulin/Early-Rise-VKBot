const { User } = require('./models/mainTable')

const addTime = async (userID, date, isRiseTime) => {
    const timeType = isRiseTime ? 'riseTime' : 'sleepTime'

    try {
        const user = await User.findOne({ userID })
        user[timeType].push(date)
        user.lastActionTime = new Date()

        await user.save()
    } catch (err) {
        console.error(err)
    }
}

const getLastActionTime = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.lastActionTime
    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastSleepTime = async userID => {
    try {
        const lastSleepTimeResponse = await User.aggregate([
            {
                $match: { userID }
            },
            {
                $project: {
                    lastSleepTime: {
                        $slice: ['$sleepTime', -1]
                    }
                }
            }
        ])

        const { lastSleepTime } = lastSleepTimeResponse[0]

        return lastSleepTime[0]
    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastSleepTimeForDays = async (userID, days) => {
    try {
        const lastSleepTimeForDaysResponse = await User.aggregate([
            {
                $match: { userID }
            },
            {
                $project: {
                    lastSleepTime: {
                        $slice: ['$sleepTime', -days]
                    }
                }
            }
        ])

        const { lastSleepTime } = lastSleepTimeForDaysResponse[0]

        return lastSleepTime
    } catch (err) {
        console.error(err)
        return []
    }
}

const getLastWakeUpTime = async userID => {
    try {
        const lastWakeUpTimeResponse = await User.aggregate([
            {
                $match: { userID }
            },
            {
                $project: {
                    lastWakeUpTime: {
                        $slice: ['$riseTime', -1]
                    }
                }
            }
        ])

        const { lastWakeUpTime } = lastWakeUpTimeResponse[0]

        return lastWakeUpTime[0]
    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLastWakeUpTimeForDays = async (userID, days) => {
    try {
        const lastWakeUpTimeResponse = await User.aggregate([
            {
                $match: { userID }
            },
            {
                $project: {
                    lastWakeUpTime: {
                        $slice: ['$riseTime', -days]
                    }
                }
            }
        ])

        const { lastWakeUpTime } = lastWakeUpTimeResponse[0]

        return lastWakeUpTime
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
