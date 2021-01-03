const api = require('node-vk-bot-api/lib/api')
const { customAlphabet } = require('nanoid')

const sendMessage = async (responseString, userID) => {
    const randomID = customAlphabet('1234567890', 10)()

    try {
        await api('messages.send', {
            access_token: process.env.TOKEN,
            user_id: userID,
            random_id: randomID,
            message: responseString,
        })
    } catch (err) {
        console.error(err)
    }
}

const getVKFirstName = async userID => {
    try {
        const userVK = await api('users.get', {
            access_token: process.env.TOKEN,
            user_id: userID,
        })

        const { first_name: firstName } = userVK.response[0]

        return firstName
    } catch (err) {
        console.error(err)
        return 'Илон Маск'
    }
}

const isJoin = joinEvent => {
    const { join_type: joinType } = joinEvent
    console.log(joinEvent)
    console.log(joinType)

    return joinType === 'approved'
}

module.exports = {
    sendMessage,
    getVKFirstName,
    isJoin,
}
