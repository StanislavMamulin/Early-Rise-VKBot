const { dockStart } = require('@nlpjs/basic')

let nlpjs

const initNlpJS = async () => {
    if (nlpjs) {
        return
    }

    try {
        const dock = await dockStart({ use: ['Basic', 'LangRu', 'LangEn'] })
        const nlp = dock.get('nlp')
        await nlp.addCorpus('./nlpjs/corpus_ru.json')
        await nlp.addCorpus('./nlpjs/corpus_en.json')
        await nlp.train()

        nlpjs = nlp
    } catch (err) {
        console.error(err)
    }
}

const getResponseType = async response => {
    try {
        await initNlpJS()
        const type = await nlpjs.process(null, response)
        const { intent } = type

        return intent
    } catch (err) {
        console.error(err)
        return null
    }
}

module.exports = {
    getResponseType,
}
