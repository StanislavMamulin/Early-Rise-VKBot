const mongoose = require('mongoose')
const config = require('config')
const { User } = require('./models/mainTable')

module.exports.connect = async () => {
    try {
        const connectString = config.get('db.connectString')
        await mongoose.connect(
            connectString,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }
        )
    } catch (err) {
        console.log('Connect failed:', err)
    }

    const db = mongoose.connection
    db.on('error', err => {
        console.log('Connection error', err)
    })
}

module.exports.createUser = async props => {
    const {
        userID,
        firstName,
        sleepNormHour = 0,
        sleepNormMinutes = 0,
        score = 0,
    } = props

    const newUser = new User({
        userID,
        firstName,
        sleepNormHour,
        sleepNormMinutes,
        score,
    })

    newUser.save(err => {
        if (err) {
            console.error(err)
        }
    })
}

module.exports.isUserExists = async userID => {
    try {
        const user = await User.findOne(
            { userID },
            'firstName'
        )

        return !!user
    } catch (err) {
        console.error(err)
        return false
    }
}

module.exports.addTime = async (userID, date, isRiseTime) => {
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

module.exports.plusScore = async (userID, score) => {
    try {
        const user = await User.findOne({ userID })
        user.score += score
        await user.save()
    } catch (err) {
        console.error(err)
    }
}

module.exports.getTotalScore = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.score
    } catch (err) {
        console.error(err)
        return 0
    }
}

module.exports.getLastActionTime = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.lastActionTime
    } catch (err) {
        console.error(err)
        return 0
    }
}

module.exports.getLastSleepTime = async userID => {
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

module.exports.getLastWakeUpTime = async userID => {
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

module.exports.getFirstName = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.firstName
    } catch (err) {
        console.error(err)
        return 'Илон'
    }
}

module.exports.getLeaderboard = async (topCount = 5) => {
    try {
        const result = await User.find({})
            .sort('-score')
            .limit(topCount)
            .select('userID firstName score')
        return result
    } catch (err) {
        console.error(err)
        return []
    }
}
