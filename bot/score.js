const MIN_GO_TO_SLEEP_HOURS = 21
const MAX_GO_TO_SLEEP_HOURS = 23
const MIN_WAKE_UP_HOURS = 5
const MAX_WAKE_UP_HOURS = 7

const isDateInRange = (minDate, maxDate, date) => date >= minDate && date <= maxDate

const getScore = (minHours, maxHours, date) => {
    const minDate = new Date().setHours(minHours, 0, 0, 0)
    const maxDate = new Date().setHours(maxHours, 0, 1, 0)

    if (isDateInRange(minDate, maxDate, date.getTime())) {
        return 10000
    }
    return 5000
}

module.exports.getScore = (date, isWakeUp) => {
    if (isWakeUp) {
        return getScore(MIN_WAKE_UP_HOURS, MAX_WAKE_UP_HOURS, date)
    }

    return getScore(MIN_GO_TO_SLEEP_HOURS, MAX_GO_TO_SLEEP_HOURS, date)
}
