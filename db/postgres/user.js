const { EarlyBirds } = require('./sequelize')

/**
 * Get User info from database
 * @param {number} userID
 * @param {string} attribute - select only this attribute
 * @returns {Promise<object>} Information about the found user
 */
 const getUserByIDAndAttribute = async (userID, attribute) => {
    return await EarlyBirds.findOne({ 
        where: { userID },
        attributes: [attribute],
    })
}

/**
 * Create a new user
 * @param {object} userinfo - Info about the created user
 * @param {number} userinfo.userID - User ID
 * @param {string} userinfo.firstName - User first name
 * @param {number} [userinfo.sleepNormHour=0] - Sleep norm in hours
 * @param {number} [userinfo.sleepNormMinutes=0] - Sleep norm in minutes
 * @param {number} [userinfo.score=0] - Starting score
 */
const createEarlyBirdUser = async userinfo => {
    const {
        userID,
        firstName,
        sleepNormHour = 8,
        sleepNormMinutes = 0,
        score = 0,
        riseTime = [],
        sleepTime = [],
    } = userinfo

    try {
        await EarlyBirds.create({
            userID,
            firstName,
            sleepNormHour,
            sleepNormMinutes,
            score,
            riseTime,
            sleepTime,
        })
    } catch (err) {
        console.error(err)
    }
}

/**
 * Check if user exists
 * @param {number} userID 
 * @returns {Promise<boolean>} User exists or not
 */
const isUserPresent = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'firstName')
        return Boolean(user)
    } catch (err) {
        console.error(err)
        return false
    }
}

/**
 * Get user first name
 * @param {number} userID 
 * @returns {Promise<string>} User first name
 */
const getUserFirstName = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'firstName')
        return user.firstName
    } catch (err) {
        console.error(err)
        return ''
    }
}

module.exports = {
    createEarlyBirdUser,
    isUserPresent,
    getUserFirstName,
}
