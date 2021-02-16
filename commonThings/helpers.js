const waitMs = ms => new Promise(resolve => {
    setTimeout(() => { resolve() }, ms)
})

module.exports = {
    waitMs,
}
