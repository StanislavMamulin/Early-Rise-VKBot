const api = require('node-vk-bot-api/lib/api')
const { customAlphabet } = require('nanoid')

const sendMessage = async (responseString, userID) => {
    const randomID = customAlphabet('1234567890', 10)()

    await api('messages.send', {
        access_token: process.env.TOKEN,
        user_id: userID,
        random_id: randomID,
        message: responseString,
    })
}

const getFirstName = async userID => {
    const userVK = await api('users.get', {
        access_token: process.env.TOKEN,
        user_id: userID,
    })

    const { first_name: firstName } = userVK.response[0]

    return firstName
}

module.exports = {
    sendMessage,
    getFirstName,
}
