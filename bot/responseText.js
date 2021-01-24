const { sunEmoji, formattedScore } = require('../commonThings/textThings')
const { topics } = require('../vk/vkdata')

const scoreString = score => `${formattedScore(score)} ${sunEmoji}`
const multipleEmoji = (emoji, number) => {
    let emojiString = ''
    for (let n = 0; n < number; n += 1) {
        emojiString += ` ${emoji}`
    }

    return emojiString
}

const getResponseString = responseParams => {
    const { greeting, firstName, score, totalScore, totalSleepTimeText, topicID, quote } = responseParams

    const greetingAndScore = `${greeting}, ${firstName}!\nВы получаете ${scoreString(score)}!\nОбщий баланс: ${scoreString(totalScore)}`
    const link = topics[topicID].linkToTopic
    const writeHere = `\n\n Ссылка Вашего часового пояса ${link}`
    const quoteString = `\n${multipleEmoji(sunEmoji, 8)}${quote}${multipleEmoji(sunEmoji, 8)}`

    return greetingAndScore + totalSleepTimeText + writeHere + quoteString
}

const getStepTrackingResponseString = (firstName, score, totalScore, topicID) => {
    const greetingAndScore = `${firstName}, за пройденные шаги Вы получаете ${scoreString(score)}!`
    const totalScoreText = `\nОбщий баланс: ${scoreString(totalScore)}`
    const link = topics[topicID].linkToTopic
    const writeHere = `\n\n Ссылка на ветку для учёта шагов: ${link}`

    return greetingAndScore + totalScoreText + writeHere
}

/*
    leaders: [{userID, firstName, score}]
*/
const getLeadersString = leaders => {
    let leaderString = 'Места распределились следующим образом:\n'

    leaders.forEach((leader, index) => {
        const { firstName, score, userID } = leader
        leaderString += `${index + 1}. ${firstName} (vk.com/id${userID}) со счётом ${scoreString(score)}\n`
    })

    return leaderString
}

const getTooFrequentlyPostingMessage = userName => `${userName}, интервал между сообщениями должен быть больше 3 часов`

const getTotalSleepTimeMessage = (hours, minutes) => `\n\nВы спали ${hours} часов ${minutes} минут.`

module.exports = {
    getResponseString,
    getLeadersString,
    getStepTrackingResponseString,
    getTooFrequentlyPostingMessage,
    getTotalSleepTimeMessage,
}
