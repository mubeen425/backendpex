const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const Promotion = connection.define('promotion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT
  },
  service: {
    type: DataTypes.TEXT
  },
  operator: {
    type: DataTypes.TEXT
  },
  value: {
    type: DataTypes.FLOAT
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  // transactions: {
  //   type: DataTypes.FLOAT
  // },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'promotion',
  timestamps: false
})

module.exports = Promotion