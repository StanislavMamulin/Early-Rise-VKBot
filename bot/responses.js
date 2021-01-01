const { isUserExists, createUser, addTime, plusScore, getTotalScore, getLastSleepTime } = require('../db/db')
const { getScore } = require('./score')
const { getDateWithTopicOffset, timestampToHoursAndMinutes, hoursInMS } = require('./time')
const { sendMessage, getFirstName, isJoin } = require('../vk/vkapi.js')
const { getResponseString } = require('./responseText')

const calculateSleepTime = async (userID, wakeUpTime) => {
    const lastSleepTime = await getLastSleepTime(userID)

    const diffTime = wakeUpTime - lastSleepTime

    // Проверка, что предыдущее время укладывания было не больше 10 часов назад
    if (lastSleepTime === 0 || diffTime > hoursInMS(10)) {
        return 0
    }

    return diffTime
}

const greetingResponse = async (firstName, userID, date, greeting, isWakeUpTime) => {
    addTime(userID, date, isWakeUpTime)

    const score = getScore(date, isWakeUpTime)
    await plusScore(userID, score)

    let totalSleepTimeText = ''
    if (isWakeUpTime) {
        const totalSleepTime = await calculateSleepTime(userID, date)
        if (totalSleepTime > 0) {
            const [hours, minutes] = timestampToHoursAndMinutes(totalSleepTime)
            totalSleepTimeText = `\n\nВы спали ${hours} часов ${minutes} минут.`
        }
    }

    const totalScore = await getTotalScore(userID)
    const responseParameters = { greeting, firstName, score, totalScore, totalSleepTimeText }
    const responseString = getResponseString(responseParameters)
    sendMessage(responseString, userID)
}

module.exports.incomingMessage = async message => {
    const {
        from_id: userID,
        text,
        topic_id: topicID,
        date,
    } = message

    const topicDate = getDateWithTopicOffset(topicID, date)
    const firstName = await getFirstName(userID)

    let isWakeUpTime
    const goodMorningGreeting = 'Доброе утро'
    if (text.trim().toLowerCase().includes(goodMorningGreeting.toLowerCase())) {
        isWakeUpTime = true
        greetingResponse(firstName, userID, topicDate, goodMorningGreeting, isWakeUpTime)
    }

    const goodNightGreeting = 'Спокойной ночи'
    if (text.trim().toLowerCase().includes(goodNightGreeting.toLowerCase())) {
        isWakeUpTime = false
        greetingResponse(firstName, userID, topicDate, goodNightGreeting, isWakeUpTime)
    }
}

module.exports.groupJoin = async joinEvent => {
    if (!isJoin(joinEvent)) {
        return
    }

    const { user_id: userID } = joinEvent
    const firstName = await getFirstName(userID)

    const userExists = await isUserExists(userID)
    if (!userExists) {
        await createUser({ userID, firstName })
    }
}
