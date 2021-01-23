const { sunEmoji, formattedScore } = require('../commonThings/textThings')
const { topics } = require('../vk/vkdata')

const scoreString = score => `${formattedScore(score)} ${sunEmoji}`

const getResponseString = responseParams => {
    const { greeting, firstName, score, totalScore, totalSleepTimeText, topicID } = responseParams

    const greetingAndScore = `${greeting}, ${firstName}!\nВы получаете ${scoreString(score)}!\nОбщий баланс: ${scoreString(totalScore)}`
    const link = topics[topicID].linkToTopic
    const writeHere = `\n\n Ссылка для написания комментария в ветке своего часового пояса ${link}`

    return greetingAndScore + totalSleepTimeText + writeHere
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

const tooFrequentlyPostingMessage = userName => `${userName}, интервал между сообщениями должен быть больше 3 часов`

module.exports = {
    getResponseString,
    getLeadersString,
    getStepTrackingResponseString,
    tooFrequentlyPostingMessage,
}
