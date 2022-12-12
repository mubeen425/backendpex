const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = require('./User.model')

const Notification = connection.define('notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100)
  },
  description: {
    type: DataTypes.TEXT
  },
  seen: {
    type: DataTypes.BOOLEAN
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
}, {
  tableName: 'notification',
  timestamps: false
})

Notification.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

module.exports = Notification