const {
    addTimeOfEvent,
    getLatestActionTime,
    getLatestBedtime,
    getLatestBedtimeForDays,
    getLastWakingTime,
    getLastWakingTimeForDays,
} = require('./postgres/time')

/**
 * Add a wake up or bedtime date
 * @param {number} userID 
 * @param {Date} date - Event date
 * @param {boolean} isRiseTime - Wake up time or sleep time
 */
export const addTime = async (userID, date, isRiseTime) => {
    try {
        await addTimeOfEvent(userID, date, isRiseTime)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Get a last action time for user
 * @param {number} userID 
 * @returns {Promise<number>} Last action time 
 */
export const getLastActionTime = async userID => {
    try {
        return await getLatestActionTime(userID)
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get latest bedtime
 * @param {number} userID 
 * @returns {Promise<number>} Latest bedtime
 */
export const getLastSleepTime = async userID => {
    try {
        return await getLatestBedtime(userID)
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get bedtime for several days
 * @param {number} userID 
 * @param {number} days - For what period the data is needed
 * @returns {Promise<Array>} Bedtime for several days
 */
export const getLastSleepTimeForDays = async (userID, days) => {
    try {
        return await getLatestBedtimeForDays(userID, days)
    } catch (err) {
        console.error(err)
        return []
    }
}

/**
 * Get latest wake up time
 * @param {number} userID 
 * @returns {Promise<number>} Latest wake up time
 */
export const getLastWakeUpTime = async userID => {
    try {
        return await getLastWakingTime(userID)
    } catch (err) {
        console.error(err)
        return 0
    }
}

/**
 * Get wake up time for several days
 * @param {number} userID 
 * @param {number} days - For what period the data is needed
 * @returns {Promise<Array>} Wake up time for several days
 */
export const getLastWakeUpTimeForDays = async (userID, days) => {
    try {
        return await getLastWakingTimeForDays(userID, days)
    } catch (err) {
        console.error(err)
        return []
    }
}
