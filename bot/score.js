// Sleep hours range
const SUPER_EVENING_START = 21
const EARLY_EVENING_START = 22
const EVENING_START = 23
const EVENING_END = 24

// Wake up hours range
const SUPER_MORNING_START = 4
const EARLY_MORNING_START = 7
const MORNING_START = 8
const MORNING_END = 12

// Score
const SUPER_SCORE = 20000
const EARLY_SCORE = 10000
const NORM_SCORE = 5000

const isHourInRange = (minHour, maxHour, hour) => hour >= minHour && hour < maxHour

// WAKE UP
const getWakeUpScore = hour => {
    if (isHourInRange(SUPER_MORNING_START, EARLY_MORNING_START, hour)) {
        return SUPER_SCORE
    }
    if (isHourInRange(EARLY_MORNING_START, MORNING_START, hour)) {
        return EARLY_SCORE
    }
    if (isHourInRange(MORNING_START, MORNING_END, hour)) {
        return NORM_SCORE
    }

    return 0
}

// SLEEP
const getGoToSleepScore = hour => {
    if (isHourInRange(SUPER_EVENING_START, EARLY_EVENING_START, hour)) {
        return SUPER_SCORE
    }
    if (isHourInRange(EARLY_EVENING_START, EVENING_START, hour)) {
        return EARLY_SCORE
    }
    if (isHourInRange(EVENING_START, EVENING_END, hour)) {
        return NORM_SCORE
    }

    return 0
}

/**
 * 
 * @param {Date} date - Event date in UTC time
 * @param {boolean} isWakeUp - This is the event of awakening or sleeping
 * @returns {number} Score
 */
module.exports.getScore = (date, isWakeUp) => {
    const hour = date.getUTCHours()

    if (isWakeUp) {
        return getWakeUpScore(hour)
    }

    return getGoToSleepScore(hour)
}
