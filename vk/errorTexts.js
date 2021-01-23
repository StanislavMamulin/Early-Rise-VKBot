const noSendPermission = name => `${name}, у Вас запрещен приём сообщений от имени группы. \n
Для включения необходимо воспользоваться инструкцией из нашей статьи: https://vk.cc/bX5L5C`

module.exports = Object.freeze({
    noSendPermission,
})
