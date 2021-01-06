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
