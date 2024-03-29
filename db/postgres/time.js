const { EarlyBirds, sequelize } = require('./sequelize')

/**
 * Get User info from database
 * @param {number} userID - user id
 * @param {string} attribute - select only this attribute
 * @returns {Promise<object>} Found User info
 */
const getUserByIDAndAttribute = async (userID, attribute) => {
    try {
        const user = await EarlyBirds.findOne({ 
            where: { userID },
            attributes: [attribute],
        })
        
        return user
    } catch (err) {
        console.error(err)
    }
}

/**
 * Add a wake up or bedtime date
 * @param {number} userID 
 * @param {Date} date - Event date
 * @param {boolean} isRiseTime - Wake up time or sleep time
 */
const addTimeOfEvent = async (userID, date, isRiseTime) => {
    const timeType = isRiseTime ? 'riseTime' : 'sleepTime'

    try {
        await EarlyBirds.update(
            { 
                [timeType] : sequelize.fn('array_append', sequelize.col(timeType), date),
                lastActionTime : date,
            },
            { where: { userID }, }
        )

    } catch (err) {
        console.error(err)
    }
}

/**
 * Get a last action time for user
 * @param {number} userID 
 * @returns {Promise<Date>} Last action time 
 */
const getLatestActionTime = async userID => {
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
 * @returns {Promise<Date>} Latest bedtime
 */
const getLatestBedtime = async userID => {
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
 * @param {number} days - For what period the data is needed
 * @returns {Promise<Date[]>} Sleep time array for several days
 */
const getLatestBedtimeForDays = async (userID, days) => {
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
 * @returns {Promise<Date>} Latest wake up time
 */
const getLastWakingTime = async userID => {
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
 * @param {number} days - For what period the data is needed
 * @returns {Promise<Date[]>} Array of wake up time for several days
 */
const getLastWakingTimeForDays = async (userID, days) => {
    try {
        const user = await getUserByIDAndAttribute(userID, 'riseTime')
        return user.riseTime.slice(-days)
    } catch (err) {
        console.error(err)
        return []
    }
}

module.exports = {
    addTimeOfEvent,
    getLatestActionTime,
    getLatestBedtime,
    getLatestBedtimeForDays,
    getLastWakingTime,
    getLastWakingTimeForDays,
}
