const { addLeadingZero } = require('./helpers')

const normalizeMonth = month => addLeadingZero(month + 1)

const getBeginningOfTheCurrentMonth = () => {
    // returned format YYYY-MM-DDT00:00:00 in UTC
    const now = new Date()
    const currentMonth = normalizeMonth(now.getMonth())
    const currentYear = now.getFullYear()
    const zeroTime = '00:00:00'
    const firstDay = '01'
    return `${currentYear}-${currentMonth}-${firstDay}T${zeroTime}`
}

const getBeginningOfThePreviousMonth = () => {
    // returned format YYYY-MM-DDT00:00:00 in UTC
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    const currentMonth = normalizeMonth(now.getMonth())
    const currentYear = now.getFullYear()
    const zeroTime = '00:00:00'
    const firstDay = '01'
    return `${currentYear}-${currentMonth}-${firstDay}T${zeroTime}`
}

module.exports = {
    getBeginningOfTheCurrentMonth,
    getBeginningOfThePreviousMonth,
}
