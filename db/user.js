const { 
    createEarlyBirdUser,
    isUserPresent,
    getUserFirstName,
 } = require('./postgres/user')

 /**
 * Create a new user
 * @param {object} userinfo - Info about the created user
 * @param {number} userinfo.userID - User ID
 * @param {string} userinfo.firstName - User first name
 * @param {number} [userinfo.sleepNormHour=0] - Sleep norm in hours
 * @param {number} [userinfo.sleepNormMinutes=0] - Sleep norm in minutes
 * @param {number} [userinfo.score=0] - Starting score
 */
export const createUser = async userinfo => {
    try {
        await createEarlyBirdUser(userinfo)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Check if user exists
 * @param {number} userID 
 * @returns {boolean} - User exists or not
 */
export const isUserExists = async userID => {
    try {
        return await isUserPresent(userID)
    } catch (err) {
        console.error(err)
        return false
    }
}

/**
 * Get user first name
 * @param {number} userID 
 * @returns {string} - User first name
 */
export const getFirstName = async userID => {
    try {
       return await getUserFirstName()
    } catch (err) {
        console.error(err)
        return ''
    }
}
