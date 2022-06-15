const { Sequelize } = require('sequelize')
const { getModel } = require('./models/EarlyBird')

let sequelize

/**
 * Connect to database
 * @param {Object} connectOptions - database connection options
 * @param {string} connectOptions.username
 * @param {string} connectOptions.password
 * @param {string} connectOptions.host
 * @param {string} connectOptions.database - database name
 * @param {number} connectOptions.port
 * @returns {Object} Sequelize instance (a connection to database)
 */
const connect = ({
    username,
    password,
    host,
    database,
    port,
  }) => new Sequelize(database, username, password, {
    dialect: 'postgres',
    host,
    port,
    query: {
        raw: true,
    }
})

/**
 * Connect to database
 * @param {Object} connectOptions - database connection options
 * @param {string} connectOptions.username
 * @param {string} connectOptions.password
 * @param {string} connectOptions.host
 * @param {string} connectOptions.database - database name
 * @param {number} connectOptions.port
 */
export const connectToDB = async (connectOptions) => {
    try {
        // Database connection
        sequelize = connect(connectOptions)
        await sequelize.authenticate()
        console.log('Successfull connection to the DB')

        // Get or creating a database model if it doesn`t exist
        const model = getModel(sequelize)
        await model.sync() // Sync a Model to the DB
    } catch (err) {
        console.error('Failed to connect to DB:', err)
    }
}

/**
 * Disconnect from database
 */
export const closeConnectionToDB = async () => {
    await sequelize.close()
}
