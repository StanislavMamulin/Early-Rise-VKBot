const { User } = require('./models/mainTable')

const plusScore = async (userID, score) => {
    try {
        const user = await User.findOne({ userID })
        user.score += score
        await user.save()
    } catch (err) {
        console.error(err)
    }
}

const getTotalScore = async userID => {
    try {
        const user = await User.findOne({ userID })
        return user.score
    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLeaderboard = async (topCount = 5) => {
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

const clearScore = async () => {
    try {
        const users = await User.find({})
        users.forEach(user => {
            user.score = 0
        })
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    plusScore,
    getTotalScore,
    getLeaderboard,
    clearScore,
}
