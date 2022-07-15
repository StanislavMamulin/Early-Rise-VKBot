const { sequelize, EarlyBirds } = require('./sequelize')

/**
 * Connect to database
 */
const connectToDB = async () => {
    try {
        // Database connection
        await sequelize.authenticate()
        console.log('Successfull connection to the DB')
        await EarlyBirds.sync() // Sync a Model to the DB
    } catch (err) {
        console.error('Failed to connect to DB:', err)
    }
}

/**
 * Disconnect from the database
 */
const closeConnectionToDB = async () => {
    try {
        await sequelize.close()
    } catch (err) {
        console.error('Failed to disconnect from the DB:', err)
    }
}

module.exports = {
    connectToDB,
    closeConnectionToDB,
}
