const mongoose = require('mongoose')
const config = require('config')

const connect = async () => {
    try {
        const connectString = config.get('db.connectString')
        await mongoose.connect(
            connectString,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }
        )
    } catch (err) {
        console.log('Connect failed:', err)
    }

    const db = mongoose.connection
    db.on('error', err => {
        console.log('Connection error', err)
    })
}

module.exports = {
    connect,
}
