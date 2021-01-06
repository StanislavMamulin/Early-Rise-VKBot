const { topics } = require('../vk/vkdata')

// convert to JS time from VK message format (add ms)
const convertToJSFormatFromVK = VKTimestamp => new Date(VKTimestamp * 1000)

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
    if (postTime - lastPostTime < this.hoursInMS(3)) {
        return false
    }

    return true
}

module.exports = {
    getDateWithTopicOffset,
    timestampToHoursAndMinutes,
    hoursInMS,
    isCorrectFrequencyPosting,
}
