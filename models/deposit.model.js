const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = require('./User.model')

const Deposit = connection.define('deposit_requests', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.FLOAT
  },
  request_status: {
    type: DataTypes.TEXT
  },
  status_description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING
  },
  requested_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'deposit_requests',
  timestamps: false
})

Deposit.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

module.exports = Deposit