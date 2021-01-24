const {
    plusScore,
    getTotalScore,
    getLeaderboard,
} = require('../db/score')

const {
    isUserExists,
    createUser,
    getFirstName,
} = require('../db/user')

const {
    getDateWithTopicOffset,
    checkFrequency,
    getTotalSleepTimeText,
} = require('./time')

const { getTypeOfGreeting, greetingTypeEnum } = require('./responseProcessing')
const { addTime } = require('../db/time')
const { getScore } = require('./score')
const { sendMessage, getVKFirstName, isJoin } = require('../vk/vkapi.js')
const { getResponseString, getTooFrequentlyPostingMessage } = require('./responseText')
const { topicType, topics } = require('../vk/vkdata')
const { stepProcessing } = require('./stepTracking')

const writeGreetingDataToDB = async (userID, score, isWakeUpTime, date) => {
    await plusScore(userID, score)
    await addTime(userID, date, isWakeUpTime)
}

const greetingResponse = async (userID, date, greeting, isWakeUpTime, topicID) => {
    const topicDate = getDateWithTopicOffset(topicID, date)
    const score = getScore(topicDate, isWakeUpTime)
    await writeGreetingDataToDB(userID, score, isWakeUpTime, topicDate)

    const totalSleepTimeText = await getTotalSleepTimeText(isWakeUpTime, userID, topicDate)
    const totalScore = await getTotalScore(userID)
    const firstName = await getFirstName(userID)

    const responseParameters = {
        greeting,
        firstName,
        score,
        totalScore,
        totalSleepTimeText,
        topicID,
    }
    const responseString = getResponseString(responseParameters)

    sendMessage(responseString, userID, topicID, firstName)
}

module.exports.incomingMessage = async message => {
    const {
        from_id: userID,
        text,
        topic_id: topicID,
        date,
    } = message

    if (topics[topicID].type === topicType.STEP_TRACKING) {
        stepProcessing(userID, text, topicID)
        return
    }

    const correctFrequently = await checkFrequency(userID, date)
    if (!correctFrequently) {
        // const message = getTooFrequentlyPostingMessage()
        return
    }

    const greeting = await getTypeOfGreeting(text)
    if (greeting === greetingTypeEnum.NONE) {
        return
    }

    const isWakeUpTime = (greeting === greetingTypeEnum.WAKE)
    greetingResponse(userID, date, greeting, isWakeUpTime, topicID)
}

module.exports.showLeaderboard = topCount => getLeaderboard(topCount)

module.exports.groupJoin = async joinEvent => {
    if (!isJoin(joinEvent)) {
        return
    }

    const { user_id: userID } = joinEvent

    const userExists = await isUserExists(userID)
    if (!userExists) {
        const firstName = await getVKFirstName(userID)
        await createUser({ userID, firstName })
    }
}
