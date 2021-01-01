const getResponseString = ({ greeting, firstName, score, totalScore, totalSleepTimeText }) => {
    const greetingAndScore = `${greeting}, ${firstName}!\nВы получаете ${score} очков!\nОбщий баланс: ${totalScore}`
    const writeHere = '\n\n Ссылка для написания комментария в ветке своего часового пояса https://vk.cc/bWmOzU'

    return greetingAndScore + totalSleepTimeText + writeHere
}

module.exports = {
    getResponseString,
}
