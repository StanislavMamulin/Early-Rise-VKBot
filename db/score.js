const { User } = require('./models/mainTable')

const plusScore = async (userID, score) => {
    try {

    } catch (err) {
        console.error(err)
    }
}

const getTotalScore = async userID => {
    try {

    } catch (err) {
        console.error(err)
        return 0
    }
}

const getLeaderboard = async (topCount = 5) => {
    try {

    } catch (err) {
        console.error(err)
        return []
    }
}

const clearScore = async () => {
    try {

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
