const api = require('node-vk-bot-api/lib/api')
const { customAlphabet } = require('nanoid')
const fs = require('fs')
const fetch = require('node-fetch')
const FormData = require('form-data')
const config = require('config')
const { waitMs } = require('../commonThings/helpers')

const { noSendPermission } = require('./errorTexts')

const sendMessageToTopic = async (topicID, message) => {
    const randomID = customAlphabet('1234567890', 10)()
    const groupID = config.get('VK.groupID')
    const token = config.get('VK.adminToken')

    try {
        await api('board.createComment', {
            access_token: token,
            group_id: groupID,
            topic_id: topicID,
            message,
            from_group: 1,
            guid: randomID,
        })
    } catch (err) {
        console.error(err)
    }
}

const getComments = async ({ topicID, quantity, offset = 0 }) => {
    const groupID = config.get('VK.groupID')
    const token = config.get('VK.adminToken')

    try {
        const comments = await api('board.getComments', {
            access_token: token,
            group_id: groupID,
            topic_id: topicID,
            count: quantity,
            offset,
        })

        const { items, count } = comments.response
        return {
            count,
            items,
        }
    } catch (err) {
        console.error(err)
        return {}
    }
}

const deleteComments = async (comments, topicID) => {
    const groupID = config.get('VK.groupID')

    const promises = comments.map(async comment => {
        const { id } = comment
        console.log('id to delete:', id)
        return api('board.deleteComment', {
            access_token: process.env.TOKEN,
            group_id: groupID,
            topic_id: topicID,
            comment_id: id,
        })
    })

    try {
        await Promise.all(promises)
    } catch (err) {
        console.error(err)
    }
}

const deleteAllComments = async (topicID, beforeDate = 0) => {
    const MAX_PER_REQUEST = 20

    try {
        const { count } = await getComments({ topicID, quantity: 0 })
        await waitMs(1000)
        console.log('Total comments:', count)

        if (count > 1) {
            const steps = Math.ceil(count / MAX_PER_REQUEST)
            console.log('steps', steps)
            for (let step = 0; step < steps; step += 1) {
                // get part of comments
                // eslint-disable-next-line no-await-in-loop
                const offset = (step === 0) ? 1 : step * MAX_PER_REQUEST
                console.log('offset', offset)
                const { items } = await getComments({ topicID, quantity: MAX_PER_REQUEST, offset })
                let comments = items

                if (beforeDate) {
                    comments = items.filter(comment => comment.date < beforeDate)
                }

                if (comments.lenght !== 0) {
                    // eslint-disable-next-line no-await-in-loop
                    await deleteComments(comments, topicID)
                    // eslint-disable-next-line no-await-in-loop
                    await waitMs(1100)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

const sendMessage = async (responseString, userID, topicID, firstName) => {
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
        const { error_code: errorCode } = err.response

        // notify the user of the required action
        if (errorCode === 901) {
            const message = noSendPermission(firstName)
            sendMessageToTopic(topicID, message)
        }
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
    getComments,
    deleteAllComments
}
