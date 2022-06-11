const { getModel } = require('./models/EarlyBird')

export const createUser = async props => {
    const {
        userID,
        firstName,
        sleepNormHour = 0,
        sleepNormMinutes = 0,
        score = 0,
    } = props

    try {
      await EarlyBird.create({
        userID,
        firstName,
        sleepNormHour,
        sleepNormMinutes,
        score,
      })
    } catch (err) {
        console.error(err)
        return false
    }
}

export const isUserExists = async userID => {
    try {
      
    } catch (err) {
        console.error(err)
        return false
    }
}

export const getFirstName = async userID => {
    try {
       
    } catch (err) {
        console.error(err)
        return ''
    }
}
