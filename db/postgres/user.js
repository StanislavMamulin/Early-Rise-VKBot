const { getModel } = require('./models/EarlyBird')

/**
 * Get User info from database
 * @param {number} userID
 * @param {string} attribute - select only this attribute
 * @returns {Promise<object>} Information about the found user
 */
 const getUserByIDAndAttribute = async (userID, attribute) => {
    const earlyBird = getModel()
    return await earlyBird.findOne({ 
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
export const createEarlyBirdUser = async userinfo => {
    const {
        userID,
        firstName,
        sleepNormHour = 0,
        sleepNormMinutes = 0,
        score = 0,
    } = userinfo

    try {
        const earlyBird = getModel()
        await earlyBird.create({
            userID,
            firstName,
            sleepNormHour,
            sleepNormMinutes,
            score,
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
export const isUserPresent = async userID => {
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
export const getUserFirstName = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'firstName')
        return user.firstName
    } catch (err) {
        console.error(err)
        return ''
    }
}
