const timeZones = {
    46727234: 7, // NSK timezone UTC+7
    46768668: 5, // YEKT UTC+5, Тюмень
}

// convert to JS time from VK message format (add ms)
const convertToJSFormatFromVK = VKTimestamp => new Date(VKTimestamp * 1000)

module.exports.getDateWithTopicOffset = (topicID, date) => {
    const inputDate = convertToJSFormatFromVK(date)
    const hoursOffset = timeZones[topicID]
    const topicTime = inputDate.setHours(inputDate.getHours() + hoursOffset) // in ms

    return new Date(topicTime)
}

module.exports.timestampToHoursAndMinutes = timestamp => {
    const timestampWithoutMS = timestamp / 1000
    const hours = Math.floor(timestampWithoutMS / 60 / 60)
    const minutes = Math.floor(timestampWithoutMS / 60) - (hours * 60)

    return [hours, minutes]
}

module.exports.hoursInMS = hours => hours * 60 * 60 * 1000

module.exports.isCorrectFrequencyPosting = (VKPostTime, lastPostTime) => {
    const postTime = convertToJSFormatFromVK(VKPostTime)
    if (postTime - lastPostTime < this.hoursInMS(3)) {
        return false
    }

    return true
}
