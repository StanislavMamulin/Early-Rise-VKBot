const {
    addScore,
    getOverallScore,
    getLeaders,
    resetAllUsersScore,
} = require('./postgres/score')

/**
 * Increment user score
 * @param {number} userID
 * @param {number} score
 */
const plusScore = async (userID, score) => {
    try {
        await addScore(userID, score)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Get User score
 * @param {number} userID 
 * @returns {Promise<number>} User current score
 */
const getTotalScore = async userID => {
    try {
        return await getOverallScore(userID)
    } catch (err) {
        console.error(err)
        return 0
    }
}

/** 
 * Get leaders
 * @param {number} [topCount=5] - How many leaders to return. Deafult value 5.
 * @returns {Promise<Array>} Each element of the array is object {userID, firstName, score}
*/
const getLeaderboard = async (topCount = 5) => {
    try {
        return getLeaders(topCount)
    } catch (err) {
        console.error(err)
        return []
    }
}

/**
 * Reset all users score
 */
const clearAllUsersScore = async () => {
    try {
        await resetAllUsersScore()
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    plusScore,
    getTotalScore,
    getLeaderboard,
    clearAllUsersScore,
}