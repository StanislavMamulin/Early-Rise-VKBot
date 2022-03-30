const { Schema, model } = require('mongoose')

const earlyRiseSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    sleepNormHour: { type: Number, default: 0 },
    sleepNormMinutes: { type: Number, default: 0 },
    score: { type: Number, required: true },
    riseTime: [Date],
    sleepTime: [Date],
    startDate: { type: Date, default: Date.now },
    sleepWellSeries: { type: Number, default: 0 },
    lastActionTime: Date,
})

module.exports.User = model('User', earlyRiseSchema)
