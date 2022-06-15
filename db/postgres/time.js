const { getModel } = require('./models/EarlyBird')

/**
 * Get User info from database
 * @param {number} userID - user id
 * @param {string} attribute - select only this attribute
 * @returns Found User info
 */
const getUserByIDAndAttribute = async (userID, attribute) => {
    const earlyBird = getModel()
    return await earlyBird.findOne({ 
        where: { userID },
        attributes: [attribute],
    })
}

/**
 * Add a wake up or bedtime date
 * @param {number} userID 
 * @param {Date} date 
 * @param {boolean} isRiseTime 
 */
export const addTimeOfEvent = async (userID, date, isRiseTime) => {
    const timeType = isRiseTime ? 'riseTime' : 'sleepTime'

    try {
        const user = await getUserByIDAndAttribute(userID, timeType)
        user[timeType].push(date)
        user.lastActionTime = new Date()

        await user.save()
    } catch (err) {
        console.error(err)
    }
}

/**
 * Get a last action time for user
 * @param {number} userID 
 * @returns 
 */
export const getLatestActionTime = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'lastActionTime')
        return user.lastActionTime
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get latest bedtime
 * @param {number} userID 
 * @returns 
 */
export const getLatestBedtime = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'sleepTime')
        return user.sleepTime[user.sleepTime.length - 1]
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get bedtime for several days
 * @param {number} userID 
 * @param {number} days 
 * @returns 
 */
export const getLatestBedtimeForDays = async (userID, days) => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'sleepTime')
        return user.sleepTime.slice(-days)
    } catch (err) {
        console.error(err)
        return []
    }
}

/**
 * Get latest wake up time
 * @param {number} userID 
 * @returns 
 */
export const getLastWakingTime = async userID => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'riseTime')
        return user.riseTime[user.riseTime.length - 1]
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get wake up time for several days
 * @param {number} userID 
 * @param {number} days 
 * @returns 
 */
export const getLastWakingTimeForDays = async (userID, days) => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'riseTime')
        return user.riseTime.slice(-days)
    } catch (err) {
        console.error(err)
        return []
    }
}
