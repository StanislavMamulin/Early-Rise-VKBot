/* eslint-disable no-mixed-operators */


/* eslint-disable no-await-in-loop */
const token = ''
const owner_id = '-134366705'

const api = require('node-vk-bot-api/lib/api')
const { waitMs } = require('../commonThings/helpers')

const changePriceForGoods = async (id, newPrice) => {
    await api('market.edit', {
        access_token: token,
        owner_id,
        item_id: id,
        price: newPrice,
    })
}

const changeSKUForGoods = async (id, sku) => {
    try {
        await api('market.edit', {
            access_token: token,
            owner_id,
            item_id: id,
            sku,
            v: '5.131',
        })
    } catch (err) {
        console.log('ERROR in change SKU')
        console.error(err)
    }
}

const changePrices = async items => {
    const filterTrafarets = /^Трафарет/i

    items.forEach(async item => {
        const { id, price, title } = item

        if (!filterTrafarets.test(title)) {
            const priceAmount = price.amount / 100
            console.log(title)
            console.log(`Old price: ${priceAmount}`)
            // calc newPrice
            const newPrice = Math.floor(priceAmount * 1.15 / 10) * 10 + 9
            console.log(`New price: ${newPrice}`)

            await changePriceForGoods(id, newPrice)
        }
    })
}

const fillSKU = async items => {
    items.forEach(async item => {
        const { sku, title, id } = item

        if (!sku) {
            // get SKU from title
            const [_, artPart] = title.trim().split(/ арт\.?/i)

            const newSku = artPart?.match(/\d{3,}/g).join('')

            if (newSku) {
                // change SKU
                console.log(`newSKU for ${title} is ${newSku}`)
                await changeSKUForGoods(id, newSku)
            }
        }
    })
}

const processGoods = async () => {
    const MAX_PER_REQUEST = 5
    const TIME_LIMIT_ON_REQUEST_TIME_MS = 1500
    const INIT_OFFSET = 200

    try {
        // 0. get count
        const goodsCount = await api('market.get', {
            access_token: token,
            owner_id,
            count: 1,
        })

        const { count } = goodsCount.response
        // const count = 22
        await waitMs(TIME_LIMIT_ON_REQUEST_TIME_MS)

        for (let offset = INIT_OFFSET; offset < count; offset += MAX_PER_REQUEST) {
            console.log(`-------------------- Offset: ${offset} ======================`)
            // get part of goods
            const goodsPart = await api('market.get', {
                access_token: token,
                owner_id,
                count: MAX_PER_REQUEST,
                offset,
                v: '5.131',
            })
            await waitMs(TIME_LIMIT_ON_REQUEST_TIME_MS)

            // 0.1 Get items
            const { items } = goodsPart.response

            // 1.0 change price of goods
            // changePrices(items)
            // 1.1 fill SKU
            await fillSKU(items)

            await waitMs(TIME_LIMIT_ON_REQUEST_TIME_MS)
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    processGoods,
}
