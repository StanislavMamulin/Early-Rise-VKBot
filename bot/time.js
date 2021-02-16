const { topics, topicType } = require('../vk/vkdata')
const { getLastSleepTime, getLastActionTime } = require('../db/time')
const { getTotalSleepTimeMessage } = require('./responseText')
const { deleteAllComments } = require('../vk/vkapi')

// convert to JS time from VK message format (add ms)
const convertToJSFormatFromVK = VKTimestamp => new Date(VKTimestamp * 1000)
const convertTimestampToVKFormat = ts => ts / 1000

const getDateWithTopicOffset = (topicID, date) => {
    const inputDate = convertToJSFormatFromVK(date)
    const hoursOffset = topics[topicID].timeZoneOffset
    const topicTime = inputDate.setHours(inputDate.getHours() + hoursOffset) // in ms

    return new Date(topicTime)
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

const getBeforeDate = () => '2021-02-01T00:00:00' // UTC, mockup

const deleteMessagesInTheLastMonth = async () => {
    const beforeDate = getBeforeDate()

    const sleepTopics = Object.keys(topics)
        .filter(id => topics[id].type === topicType.SLEEP_TRACKING)

    const promise = sleepTopics.reduce((acc, topicID) => {
        const newAcc = acc.then(() => {
            const { timeZoneOffset } = topics[topicID]
            const offsettedDate = new Date(`${beforeDate}+0${timeZoneOffset}:00`)
            const needTime = convertTimestampToVKFormat(offsettedDate.getTime())
            return deleteAllComments(topicID, needTime)
        })
        return newAcc
    }, Promise.resolve())

    promise.catch(err => {
        console.error(err)
    })
}

module.exports = {
    getDateWithTopicOffset,
    timestampToHoursAndMinutes,
    hoursInMS,
    isCorrectFrequencyPosting,
    getTotalSleepTimeText,
    checkFrequency,
    deleteMessagesInTheLastMonth,
}
