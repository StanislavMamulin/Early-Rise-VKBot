const { topics, topicType } = require('./vkdata')
const { deleteAllComments } = require('./vkapi')
const { getBeginningOfThePreviousMonth } = require('../commonThings/time')

const convertTimestampToVKFormat = ts => ts / 1000

const getStepTopicURL = () => {
    let stepTrackingURL = ''

    Object.keys(topics).forEach(topicID => {
        const topic = topics[topicID]
        if (topic.type === topicType.STEP_TRACKING) {
            stepTrackingURL = topic.linkToTopic
        }
    })

    return new URL(stepTrackingURL)
}

const getSleepTopicIDs = () => Object.keys(topics)
    .filter(id => topics[id].type === topicType.SLEEP_TRACKING)

const getTopicLink = topicID => topics[topicID].linkToTopic

const isStepTopic = topicID => topics[topicID].type === topicType.STEP_TRACKING

const getTimeZoneOffset = topicID => topics[topicID].timeZoneOffset

const deleteMessagesInTheLastMonth = async () => {
    const beforeDate = getBeginningOfThePreviousMonth()
    const sleepTopics = getSleepTopicIDs()

    const promise = sleepTopics.reduce((acc, topicID) => {
        const newAcc = acc.then(() => {
            const timeZoneOffset = getTimeZoneOffset(topicID)
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
    getStepTopicURL,
    getSleepTopicIDs,
    getTopicLink,
    isStepTopic,
    getTimeZoneOffset,
    deleteMessagesInTheLastMonth,
}
