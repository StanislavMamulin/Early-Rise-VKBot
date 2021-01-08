const { plusScore, getTotalScore } = require('../db/score')
const { getFirstName } = require('../db/user')
const { sendMessage } = require('../vk/vkapi.js')
const { getStepTrackingRescponseString: getStepTrackingResponseString } = require('./responseText')

const getStepNumberFrom = text => {
    const steps = text.match(/\d+/g)
    if (!steps) {
        return 0
    }

    return Number(steps.join(''))
}

const calculateScore = steps => Math.round(steps / 10)

const sendMessageToUser = async (userID, score, topicID) => {
    const totalScore = await getTotalScore(userID)
    const firstName = await getFirstName(userID)
    const stepTrackingText = getStepTrackingResponseString(firstName, score, totalScore, topicID)
    sendMessage(stepTrackingText, userID)
}

const stepProcessing = async (userID, text, topicID) => {
    const steps = getStepNumberFrom(text)
    const score = calculateScore(steps)

    await plusScore(userID, score)
    sendMessageToUser(userID, score, topicID)
}

module.exports = {
    stepProcessing,
}
