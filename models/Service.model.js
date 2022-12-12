const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const Service = connection.define('service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service: {
    type: DataTypes.TEXT
  },
  operator: {
    type: DataTypes.TEXT
  },
  package: {
    type: DataTypes.TEXT
  },
  contact: {
    type: DataTypes.TEXT
  },
  meter_number: {
    type: DataTypes.TEXT
  },
  payment_code: {
    type: DataTypes.TEXT
  },
  bloom_pay_id: {
    type: DataTypes.TEXT
  },
  promotion: {
    type: DataTypes.TEXT
  },
  name: {
    type: DataTypes.TEXT
  },
  email: {
    type: DataTypes.TEXT
  },
  bank: {
    type: DataTypes.TEXT
  },
  iban: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'service',
  timestamps: false
})

module.exports = Service