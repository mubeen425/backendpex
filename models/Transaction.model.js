const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = require('./User.model')
const Service = require('./Service.model')

const Transaction = connection.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.FLOAT
  },
  total: {
    type: DataTypes.FLOAT
  },
  body: {
    type: DataTypes.TEXT
  },
  response: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.TEXT
  },
  created_at: {
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
  service_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Service,
      key: 'id'
    }
  }
}, {
  tableName: 'transaction',
  timestamps: false
})

Transaction.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

Transaction.belongsTo(Service, {
  as: 'service',
  foreignKey: 'service_id'
})

module.exports = Transaction