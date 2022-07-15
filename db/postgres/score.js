const { Op } = require('sequelize')
const { EarlyBirds } = require('./sequelize')

/**
 * Increment user score
 * @param {number} userID
 * @param {number} score
 */
const addScore = async (userID, score) => {
    try {
        await EarlyBirds.increment('score', { by: score, where: { userID } })
    } catch (err) {
        console.error(err)
    }
}

/**
 * Get User score
 * @param {number} userID 
 * @returns {Promise<number>} User current score
 */
const getOverallScore = async userID => {
    try {
        const user = await EarlyBirds.findOne({ where: { userID }})
        return user.score
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
const getLeaders = async (topCount = 5) => {
    try {
        return await EarlyBirds.findAll({
            attributes: ['userID', 'firstName', 'score'],
            where: { score: { [Op.gt]: 0, } },
            limit: topCount,
            order: [ ['score', 'DESC'] ],
        })
    } catch (err) {
        console.error(err)
        return []
    }
}

/**
 * Reset all users score
 */
const resetAllUsersScore = async () => {
    try {
        await EarlyBirds.update({ score: 0 }, { where: {} })
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    addScore,
    getOverallScore,
    getLeaders,
    resetAllUsersScore,    
}
