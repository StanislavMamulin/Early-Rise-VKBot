const fetch = require('node-fetch')

const getQuoteFromForismatic = async () => {
    const requestParameters = new URLSearchParams({
        method: 'getQuote',
        format: 'json',
        key: 982317,
        lang: 'ru',
    })
    const URL = `http://api.forismatic.com/api/1.0/?${requestParameters.toString()}`

    try {
        const quoteResponse = await fetch(URL, {
            method: 'POST',
        })

        const quoteObject = await quoteResponse.json()
        const { quoteText, quoteAuthor } = quoteObject

        return `\n${quoteText} ${quoteAuthor}\n`
    } catch (err) {
        console.error(err)
        return ''
    }
}

const getQuote = async () => {
    let quote = ''
    try {
        quote = await getQuoteFromForismatic()
    } catch (err) {
        console.error(err)
    }
    return quote
}

module.exports = {
    getQuote,
}
