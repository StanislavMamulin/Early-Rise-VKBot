const { Op } = require('sequelize')

const { EarlyBird } = require('./models/mainTable')

/**
 * Increment user score
 * @param {number} userID
 * @param {number} score
 */
export const plusScore = async (userID, score) => {
    try {
        const user = await EarlyBird.findOne({ where: { userID } })
        await user.increment('score', { by: score })
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
        const user = await EarlyBird.findOne({ where: { userID }})
        return user.score
    } catch (err) {
        console.error(err)
        return 0
    }
}

/** 
 * Get leaders
 * @param {number} topCount - How many leaders to return
 * @returns {Array} Each elemnt of the array is object {userID, firstName, score}
*/
export const getLeaderboard = async (topCount = 5) => {
    try {
        const result = await EarlyBird.findAll({
            attributes: ['userID', 'firstName', 'score'],
            where: { score: { [Op.gt]: 0, } },
            limit: topCount,
            order: [ ['score', 'DESC'] ],
        })
        return result
    } catch (err) {
        console.error(err)
        return []
    }
}

/**
 * Reset all users score
 */
export const clearScore = async () => {
    try {
        await EarlyBird.update({ score: 0 }, { where: {} })
    } catch (err) {
        console.error(err)
    }
}
