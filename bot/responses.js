const api = require('node-vk-bot-api/lib/api')
const { customAlphabet } = require('nanoid')

const { userExists, createUser } = require('../db/db')

const sendMessage = async (responseString, userID) => {
    const randomID = customAlphabet('1234567890', 10)()

    await api('messages.send', {
        access_token: process.env.TOKEN,
        user_id: userID,
        random_id: randomID,
        message: responseString,
    })
}

const goodMorningResponse = async (firstName, userID) => {
    const responseString = `Доброе утро, ${firstName}!`
    sendMessage(responseString, userID)

    const user = await userExists(userID)
    if (!user) {
        await createUser({ userID, firstName })
    }
}

const goodNightResponse = (firstName, userID) => {
    const responseString = `Спокойной ночи, ${firstName}!`
    sendMessage(responseString, userID)
}

module.exports.incomingMessage = async message => {
    const { from_id: userID, text } = message

    const userVK = await api('users.get', {
        access_token: process.env.TOKEN,
        user_id: userID,
    })
    const { first_name: firstName } = userVK.response[0]

    if (text.toLowerCase() === 'доброе утро') {
        goodMorningResponse(firstName, userID)
    }
    if (text.toLowerCase() === 'спокойной ночи') {
        goodNightResponse(firstName, userID)
    }
}
