const config = require('config')
const { connectToDB, closeConnectionToDB } = require('./postgres/db')

/**
 * Connect to database
 */
const connect = async () => {
    try {
        const connectOptions = config.get('db.pgConfig')
        await connectToDB(connectOptions)
    } catch (err) {
        console.error('Connect failed:', err)
    }
}

/**
 * Disconnect from the database
 */
const disconnect = async () => {
    try {
        await closeConnectionToDB()
    } catch (err) {
        console.error('Disconnect failed', err)
    }
}

module.exports = {
    connect,
    disconnect,
}
