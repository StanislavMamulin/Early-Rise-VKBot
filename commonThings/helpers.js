const addLeadingZero = number => ('0' + number).slice(-2)

const waitMs = ms => new Promise(resolve => {
    setTimeout(() => { resolve() }, ms)
})

module.exports = {
    waitMs,
    addLeadingZero,
}
