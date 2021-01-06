const topicType = Object.freeze({
    STEP_TRACKING: 'Step tracking',
    SLEEP_TRACKING: 'Sleep tracking',
})

const topics = Object.freeze({
    46727234: {
        timeZoneOffset: 7,
        linkToTopic: 'https://vk.cc/bWmOzU',
        readingName: 'UTC+7 - Krasnoyarsk Time Zone (KRAT), NSK',
        type: topicType.SLEEP_TRACKING,
    },
    46768668: {
        timeZoneOffset: 5,
        linkToTopic: 'https://vk.cc/bWM5uC',
        readingName: 'UTC+5 - YEKT, Tyumen',
        type: topicType.SLEEP_TRACKING,
    },
    46787838: {
        timeZoneOffset: 3,
        linkToTopic: 'https://vk.cc/bWQnb9',
        readingName: 'UTC+3 - MSK, Lviv',
        type: topicType.SLEEP_TRACKING,
    },
    46787606: {
        timeZoneOffset: 0,
        linkToTopic: 'https://vk.cc/bWRVYo',
        readingName: 'Учёт шагов',
        type: topicType.STEP_TRACKING,
    }
})

module.exports = {
    topicType,
    topics,
}
