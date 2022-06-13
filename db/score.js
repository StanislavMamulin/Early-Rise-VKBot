const { User } = require('./models/mainTable')
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
export const plusScore = async (userID, score) => {
    try {
        await addScore(userID, score)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Get User score
 * @param {number} userID 
 * @returns {number} User current score
 */
export const getTotalScore = async userID => {
    try {
        return getOverallScore(userID)
    } catch (err) {
        console.error(err)
        return 0
    }
}

/** 
 * Get leaders
 * @param {number} [topCount=5] - How many leaders to return. Deafult value 5.
 * @returns {Array} Each elemnt of the array is object {userID, firstName, score}
*/
export const getLeaderboard = async (topCount = 5) => {
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
export const clearAllUsersScore = async () => {
    try {
        await resetAllUsersScore()
    } catch (err) {
        console.error(err)
    }
}
