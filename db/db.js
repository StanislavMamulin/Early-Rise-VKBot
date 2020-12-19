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
    } = props

    const newUser = new User({
        userID,
        firstName,
        sleepNormHour,
        sleepNormMinutes,
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
