const { getResponseType } = require('../nlpjs/nlpjs')

const greetingTypeEnum = Object.freeze({
    WAKE: 'Доброе утро',
    SLEEP: 'Спокойной ночи',
    NONE: 'none',
})

const addOtherPhraseToGreetings = () => {
}

const getTypeOfGreeting = async greeting => {
    try {
        const greetingType = await getResponseType(greeting)

        if (greetingType === 'None') {
            // Добавить строку в варианты приветствия
            addOtherPhraseToGreetings()
        }

        return greetingTypeEnum[greetingType.toUpperCase()]
    } catch (err) {
        console.error(err)
        return null
    }
}

module.exports = {
    getTypeOfGreeting,
    greetingTypeEnum,
}
