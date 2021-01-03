// const MIN_GO_TO_SLEEP_HOURS = 21
// const MAX_GO_TO_SLEEP_HOURS = 23
// const MIN_WAKE_UP_HOURS = 5
// const MAX_WAKE_UP_HOURS = 7

class TimeInterval {
    constructor(min, max, score) {
        this.min = min
        this.max = max
        this.score = score
    }
}

// Sleep hours range
const FINE_TIME_GO_TO_SLEEP_MIN = 21
const FINE_TIME_GO_TO_SLEEP_MAX = 22
const GOOD_TIME_GO_TO_SLEEP_MIN = 22
const GOOD_TIME_GO_TO_SLEEP_MAX = 23

// Wake up hours range
const FINE_TIME_TO_WAKE_UP_MIN = 5
const FINE_TIME_TO_WAKE_UP_MAX = 6
const GOOD_TIME_TO_WAKE_UP_MIN = 6
const GOOD_TIME_TO_WAKE_UP_MAX = 7

// Score
const FINE_SCORE = 10000
const GOOD_SCORE = 10000
const NORM_SCORE = 5000

// const fineTimeGoToSleep = new TimeInterval(FINE_TIME_GO_TO_SLEEP_MIN, FINE_TIME_GO_TO_SLEEP_MAX, FINE_SCORE)

// const isDateInRange = (minDate, maxDate, date) => date >= minDate && date <= maxDate
const isHourInRange = (minHour, maxHour, hour) => hour >= minHour && hour < maxHour

// const getScore = (minHours, maxHours, date) => {
//     const minDate = new Date().setHours(minHours, 0, 0, 0)
//     const maxDate = new Date().setHours(maxHours, 0, 1, 0)

//     if (isDateInRange(minDate, maxDate, date.getTime())) {
//         return 10000
//     }
//     return 5000
// }

// WAKE UP
const getWakeUpScore = hour => {
    if (isHourInRange(FINE_TIME_TO_WAKE_UP_MIN, FINE_TIME_TO_WAKE_UP_MAX, hour)) {
        return FINE_SCORE
    }
    if (isHourInRange(GOOD_TIME_TO_WAKE_UP_MIN, GOOD_TIME_TO_WAKE_UP_MAX, hour)) {
        return GOOD_SCORE
    }

    return NORM_SCORE
}

// SLEEP
const getGoToSleepScore = hour => {
    if (isHourInRange(FINE_TIME_GO_TO_SLEEP_MIN, FINE_TIME_GO_TO_SLEEP_MAX, hour)) {
        return FINE_SCORE
    }
    if (isHourInRange(GOOD_TIME_GO_TO_SLEEP_MIN, GOOD_TIME_GO_TO_SLEEP_MAX, hour)) {
        return GOOD_SCORE
    }

    return NORM_SCORE
}

module.exports.getScore = (date, isWakeUp) => {
    const hour = date.getHours()

    if (isWakeUp) {
        return getWakeUpScore(hour)
    }

    return getGoToSleepScore(hour)
}
