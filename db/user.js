const createUser = async props => {
    const {
        userID,
        firstName,
        sleepNormHour = 0,
        sleepNormMinutes = 0,
        score = 0,
    } = props
}

const isUserExists = async userID => {
    try {
      
    } catch (err) {
        console.error(err)
        return false
    }
}

const getFirstName = async userID => {
    try {
       
    } catch (err) {
        console.error(err)
        return 'Илон'
    }
}

module.exports = {
    createUser,
    isUserExists,
    getFirstName,
}
