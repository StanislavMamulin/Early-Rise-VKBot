const { topics, topicType } = require('./vkdata')

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

module.exports = {
    getStepTopicURL,
    getSleepTopicIDs,
    getTopicLink,
    isStepTopic,
    getTimeZoneOffset,
}
