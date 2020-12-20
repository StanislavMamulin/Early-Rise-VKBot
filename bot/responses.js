const { userExists, createUser, addTime, plusScore, getTotalScore } = require('../db/db')
const { getScore } = require('./score')
const { getDateWithTopicOffset } = require('./time')
const { sendMessage, getFirstName, isJoin } = require('../vk/vkapi.js')

const greetingResponse = async (firstName, userID, date, greeting, isWakeUpTime) => {
    addTime(userID, date, isWakeUpTime)

    const score = getScore(date, isWakeUpTime)
    await plusScore(userID, score)

    const totalScore = await getTotalScore(userID)
    const responseString = `${greeting}, ${firstName}!\nВы получаете ${score} очков!\nОбщий баланс: ${totalScore}`
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
    if (text.toLowerCase() === 'доброе утро') {
        isWakeUpTime = true
        const greeting = 'Доброе утро'
        greetingResponse(firstName, userID, topicDate, greeting, isWakeUpTime)
    }
    if (text.toLowerCase() === 'спокойной ночи') {
        isWakeUpTime = false
        const greeting = 'Спокойной ночи'
        greetingResponse(firstName, userID, topicDate, greeting, isWakeUpTime)
    }
}

module.exports.groupJoin = async joinEvent => {
    if (!isJoin(joinEvent)) return

    const { user_id: userID } = joinEvent
    const firstName = await getFirstName(userID)

    const user = await userExists(userID)
    if (!user) await createUser({ userID, firstName })
}
