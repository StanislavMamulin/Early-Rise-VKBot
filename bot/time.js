const timeZones = {
    46727234: 7, // NSK timezone UTC+7
}

module.exports.getDateWithTopicOffset = (topicID, date) => {
    const inputDate = new Date(date * 1000) // convert to JS time from VK message format (add ms)
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
