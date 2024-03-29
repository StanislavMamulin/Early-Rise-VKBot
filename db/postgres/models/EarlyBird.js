const { DataTypes } = require('sequelize')

/**
 * Create a database model
 * @param {object} sequelize - Sequelize instance
 * @returns {object} EarlyBird (DB model)
 */
const createModel = sequelize => sequelize.define('EarlyBird', {
  userID: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sleepNormHour: {
    type: DataTypes.INTEGER,
    defaultValue: 8,
  },
  sleepNormMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  riseTime: DataTypes.ARRAY(DataTypes.DATE),
  sleepTime: DataTypes.ARRAY(DataTypes.DATE),
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  sleepWellSeries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastActionTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
})

module.exports = {
  createModel,    
}
