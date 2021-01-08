const api = require('node-vk-bot-api/lib/api')
const { customAlphabet } = require('nanoid')
const fs = require('fs')
const fetch = require('node-fetch')
const FormData = require('form-data')

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

const sendMessageWithPhoto = async (userID, ownerID, mediaID) => {
    try {
        const randomID = customAlphabet('1234567890', 10)()
        const photoAttachmentString = `photo${ownerID}_${mediaID}`

        api('messages.send', {
            access_token: process.env.TOKEN,
            user_id: userID,
            random_id: randomID,
            attachment: photoAttachmentString,
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

const getUploadServer = async userID => {
    try {
        const getServerResponse = await api('photos.getMessagesUploadServer', {
            peer_id: userID,
            access_token: process.env.TOKEN,
        })

        return getServerResponse.response
    } catch (err) {
        console.error(err)
        return {}
    }
}

const sendPhotoToGroup = async (URL, photoPath) => {
    const formData = new FormData()
    formData.append('photo', fs.createReadStream(photoPath))

    try {
        const postResponse = await fetch(URL, {
            method: 'POST',
            body: formData,
        })

        return await postResponse.json()
    } catch (err) {
        console.error(err)
        return {}
    }
}

const saveMessagePhoto = async (server, photo, hash) => {
    const uploadPhotoResponse = await api('photos.saveMessagesPhoto', {
        access_token: process.env.TOKEN,
        server,
        photo,
        hash,
    })

    return uploadPhotoResponse.response[0]
}

const sendPhotoToVKUser = async (userID, atPath) => {
    try {
        // 0. Получить адрес для загрузки фото
        const { upload_url: URL } = await getUploadServer(userID)

        // 1. Загрузить фото POST-запросом
        const { server, photo, hash } = await sendPhotoToGroup(URL, atPath)

        // 2.сохранить фотографию
        const { id, owner_id: ownerID } = await saveMessagePhoto(server, photo, hash)

        sendMessageWithPhoto(userID, ownerID, id)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    sendMessage,
    sendMessageWithPhoto,
    getVKFirstName,
    isJoin,
    sendPhotoToVKUser,
}
