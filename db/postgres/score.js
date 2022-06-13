const { Op } = require('sequelize')

const { getModel } = require('./models/EarlyBird')

/**
 * Increment user score
 * @param {number} userID
 * @param {number} score
 */
export const addScore = async (userID, score) => {
    try {
        const earlyBird = getModel()
        const user = await earlyBird.findOne({ where: { userID } })
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
export const getOverallScore = async userID => {
    try {
        const earlyBird = getModel()
        const user = await earlyBird.findOne({ where: { userID }})
        return user.score
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
export const getLeaders = async (topCount = 5) => {
    try {
        const earlyBird = getModel()
        const result = await earlyBird.findAll({
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
export const resetAllUsersScore = async () => {
    try {
        const earlyBird = getModel()
        await earlyBird.update({ score: 0 }, { where: {} })
    } catch (err) {
        console.error(err)
    }
}
