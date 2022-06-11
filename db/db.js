const config = require('config')
const { connectToDB, closeConnectionToDB } = require('./postgres/db')

export const connect = async () => {
    try {
        const connectOptions = config.get('db.pgConfig')
        await connectToDB(connectOptions)
    } catch (err) {
        console.error('Connect failed:', err)
    }
}

export const disconnect = async () => {
    try {
        await closeConnectionToDB()
    } catch (err) {
        console.error('Disconnect failed', err)
    }
}
