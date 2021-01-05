const {
    isUserExists,
    createUser,
    addTime,
    plusScore,
    getTotalScore,
    getLastSleepTime,
    getFirstName,
    getLastActionTime,
    getLeaderboard,
} = require('../db/db')
const { getScore } = require('./score')
const {
    getDateWithTopicOffset,
    timestampToHoursAndMinutes,
    hoursInMS,
    isCorrectFrequencyPosting,
} = require('./time')
const { sendMessage, getVKFirstName, isJoin } = require('../vk/vkapi.js')
const { getResponseString } = require('./responseText')

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
            totalSleepTimeText = `\n\nВы спали ${hours} часов ${minutes} минут.`
        }
    }

    return totalSleepTimeText
}

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

    sendMessage(responseString, userID)
}

const checkFrequency = async (userID, postTime) => {
    const lastPostTime = await getLastActionTime(userID)
    return isCorrectFrequencyPosting(postTime, lastPostTime)
}

module.exports.incomingMessage = async message => {
    const {
        from_id: userID,
        text,
        topic_id: topicID,
        date,
    } = message

    const goodMorningGreeting = 'Доброе утро'
    if (text.trim().toLowerCase().includes(goodMorningGreeting.toLowerCase())) {
        const correctFrequently = await checkFrequency(userID, date)
        if (!correctFrequently) {
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
