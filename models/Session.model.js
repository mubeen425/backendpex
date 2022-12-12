const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = require('./User.model')

const Session = connection.define('session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(64)
  },
  login_timestamp: {
    type: DataTypes.DATE
  },
  expiry_timestamp: {
    type: DataTypes.DATE
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
}, {
  tableName: 'session',
  timestamps: false
})

Session.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

module.exports = Session