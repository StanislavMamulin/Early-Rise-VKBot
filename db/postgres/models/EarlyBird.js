const { DataTypes } = require('sequelize')

let model;

/**
 * Create a database model
 * @param {Object} sequelize - Sequelize instance
 * @returns {Object} EarlyBird (DB model)
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
  lastActionTime: DataTypes.DATE,
})

/**
 * Get or creating a database model if it doesn`t exist
 * @param {Object} sequelize - Sequelize instance
 * @returns {Object} EarlyBird (DB model)
 */
export const getModel = sequelize => {
  if (!model) {
    model = createModel(sequelize)
  }

  return model
}