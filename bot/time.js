const { getTimeZoneOffset } = require('../vk/dataManager')
const { getLastSleepTime, getLastActionTime } = require('../db/time')
const { getTotalSleepTimeMessage } = require('./responseText')

/**
 * Convert to JS time from VK message format (adds ms)
 * @param {number} VKTimestamp - Date timestamp in seconds format
 * @returns {number} Date timestamp in millisecond format
 */
const convertToJSFormatFromVK = VKTimestamp => VKTimestamp * 1000

/**
 * Get UTC date with timezone offset
 * @param {number} topicID - Topic ID
 * @param {number} date - Message timestamp in seconds format
 * @returns {Date} Date object with "local UTC" timestamp. 
 * Where the UTC time is offset by the time of the event.
 */
const getDateWithTopicOffset = (topicID, date) => {
    const inputDate = new Date(convertToJSFormatFromVK(date))
    const hoursOffset = getTimeZoneOffset(topicID)

    inputDate.setUTCHours(inputDate.getUTCHours() + hoursOffset)

    return inputDate
}

const timestampToHoursAndMinutes = timestamp => {
    const timestampWithoutMS = timestamp / 1000
    const hours = Math.floor(timestampWithoutMS / 60 / 60)
    const minutes = Math.floor(timestampWithoutMS / 60) - (hours * 60)

    return [hours, minutes]
}

const hoursInMS = hours => hours * 60 * 60 * 1000

const isCorrectFrequencyPosting = (VKPostTime, lastPostTime) => {
    const postTime = convertToJSFormatFromVK(VKPostTime)
    if (postTime - lastPostTime < hoursInMS(3)) {
        return false
    }

    return true
}

const checkFrequency = async (userID, postTime) => {
    const lastPostTime = await getLastActionTime(userID)
    return isCorrectFrequencyPosting(postTime, lastPostTime)
}

/**
 * 
 * @param {number} userID - User ID
 * @param {Date} wakeUpTime - Wake up time
 * @returns {Promise<number>} Sleep time in ms
 */
const calculateSleepTime = async (userID, wakeUpTime) => {
    const lastSleepTime = await getLastSleepTime(userID)

    const diffTime = wakeUpTime - lastSleepTime

    // Проверка, что предыдущее время укладывания было не больше 12 часов назад
    if (lastSleepTime === 0 || diffTime > hoursInMS(12)) {
        return 0
    }

    return diffTime
}

const getTotalSleepTimeText = async (isWakeUpTime, userID, date) => {
    let totalSleepTimeText = ''

    if (isWakeUpTime) {
        const totalSleepTime = await calculateSleepTime(userID, date)

        if (totalSleepTime > 0) {
            const [hours, minutes] = timestampToHoursAndMinutes(totalSleepTime)
            totalSleepTimeText = getTotalSleepTimeMessage(hours, minutes)
        }
    }

    return totalSleepTimeText
}

module.exports = {
    getDateWithTopicOffset,
    timestampToHoursAndMinutes,
    hoursInMS,
    isCorrectFrequencyPosting,
    getTotalSleepTimeText,
    checkFrequency,
}
