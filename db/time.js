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
 * @param {Date} date 
 * @param {boolean} isRiseTime 
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
 * @returns 
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
 * @returns 
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
 * @param {number} days 
 * @returns 
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
 * @returns 
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
 * @param {number} days 
 * @returns 
 */
export const getLastWakeUpTimeForDays = async (userID, days) => {
    try {
        return await getLastWakingTimeForDays(userID, days)
    } catch (err) {
        console.error(err)
        return []
    }
}
