const timeZones = {
    46727234: 7, // NSK timezone UTC+7
}

module.exports.getDateWithTopicOffset = (topicID, date) => {
    const inputDate = new Date(date * 1000) // convert to JS time from EPOCH format (add ms)
    const hoursOffset = timeZones[topicID]
    const topicTime = inputDate.setHours(inputDate.getHours() + hoursOffset) // in ms

    return new Date(topicTime)
}