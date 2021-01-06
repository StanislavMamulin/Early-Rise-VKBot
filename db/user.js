const { User } = require('./models/mainTable')

const createUser = async props => {
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

const isUserExists = async userID => {
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

const getFirstName = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.firstName
    } catch (err) {
        console.error(err)
        return 'Илон'
    }
}

module.exports = {
    createUser,
    isUserExists,
    getFirstName,
}
