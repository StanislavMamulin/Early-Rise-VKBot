const { sunEmoji, formattedScore } = require('../commonThings/textThings')

const linkToTopic = {
    46727234: 'https://vk.cc/bWmOzU', // NSK timezone UTC+7
    46768668: 'https://vk.cc/bWM5uC', // YEKT UTC+5, Тюмень
}

const scoreString = score => `${formattedScore(score)} ${sunEmoji}`

const getResponseString = responseParams => {
    const { greeting, firstName, score, totalScore, totalSleepTimeText, topicID } = responseParams

    const greetingAndScore = `${greeting}, ${firstName}!\nВы получаете ${scoreString(score)}!\nОбщий баланс: ${scoreString(totalScore)}`
    const link = linkToTopic[topicID]
    const writeHere = `\n\n Ссылка для написания комментария в ветке своего часового пояса ${link}`

    return greetingAndScore + totalSleepTimeText + writeHere
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

module.exports = {
    getResponseString,
    getLeadersString,
}
