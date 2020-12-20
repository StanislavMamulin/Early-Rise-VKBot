const mongoose = require('mongoose')
const config = require('config')
const { User } = require('./models/mainTable')

module.exports.connect = async () => {
    try {
        await mongoose.connect(config.get('db.connectString'),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
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
            console.log(err)
            return
        }
        console.log('User saved')
    })
}

module.exports.userExists = async userID => {
    const user = await User.findOne({ userID })

    return !!user
}

module.exports.addTime = async (userID, date, isRiseTime) => {
    const timeType = isRiseTime ? 'riseTime' : 'sleepTime'

    try {
        const user = await User.findOne({ userID })
        user[timeType].push(date)
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
