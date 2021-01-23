const {
    plusScore,
    getTotalScore,
    getLeaderboard,
} = require('../db/score')
const { addTime } = require('../db/time')
const {
    isUserExists,
    createUser,
    getFirstName,
} = require('../db/user')

const { getScore } = require('./score')
const {
    getDateWithTopicOffset,
    checkFrequency,
    getTotalSleepTimeText,
} = require('./time')
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

    const goodMorningGreeting = 'Доброе утро'
    if (text.trim().toLowerCase().includes(goodMorningGreeting.toLowerCase())) {
        const correctFrequently = await checkFrequency(userID, date)
        if (!correctFrequently) {
            // const message = getTooFrequentlyPostingMessage()
            return
        }

        const isWakeUpTime = true
        greetingResponse(userID, date, goodMorningGreeting, isWakeUpTime, topicID)
    }

    const goodNightGreeting = 'Спокойной ночи'
    if (text.trim().toLowerCase().includes(goodNightGreeting.toLowerCase())) {
        const correctFrequently = await checkFrequency(userID, date)
        if (!correctFrequently) {
            return
        }

        const isWakeUpTime = false
        greetingResponse(userID, date, goodNightGreeting, isWakeUpTime, topicID)
    }
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
