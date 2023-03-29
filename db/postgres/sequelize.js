const { Sequelize } = require('sequelize')
const config = require('config')
const { createModel } = require('./models/EarlyBird')

const {
    username,
    password,
    host,
    database,
    port,
} = config.get('db.pgConfig')

const sequelize = new Sequelize(database, username, password, {
    dialect: 'postgres',
    host,
    port,
    query: {
        raw: true,
    }
})

const EarlyBirds = createModel(sequelize)

module.exports = {
    sequelize,
    EarlyBirds,
}
