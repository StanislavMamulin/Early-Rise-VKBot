const linkToTopic = {
    46727234: 'https://vk.cc/bWmOzU', // NSK timezone UTC+7
    46768668: 'https://vk.cc/bWM5uC', // YEKT UTC+5, Тюмень
}

const getResponseString = responseParams => {
    const { greeting, firstName, score, totalScore, totalSleepTimeText, topicID } = responseParams

    const greetingAndScore = `${greeting}, ${firstName}!\nВы получаете ${score} очков!\nОбщий баланс: ${totalScore}`
    const link = linkToTopic[topicID]
    const writeHere = `\n\n Ссылка для написания комментария в ветке своего часового пояса ${link}`

    return greetingAndScore + totalSleepTimeText + writeHere
}

module.exports = {
    getResponseString,
}
