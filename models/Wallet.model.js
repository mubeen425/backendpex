const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = require('./User.model')

const Card = connection.define('card', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  balance: {
    type: DataTypes.FLOAT
  },
  totalInvested: {
    type: DataTypes.FLOAT
  },
  margin: {
    type: DataTypes.FLOAT
  },
  pending: {
    type: DataTypes.FLOAT
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
  }
}, {
  tableName: 'wallet',
  timestamps: false
})

Card.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})

module.exports = Card