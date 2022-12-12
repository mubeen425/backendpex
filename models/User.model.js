const { DataTypes } = require('sequelize')
const connection = require('../utilities/connection')

const User = connection.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  displayName: {
    type: DataTypes.TEXT
  },
  firstName: {
    type: DataTypes.TEXT
  },
  lastName: {
    type: DataTypes.TEXT
  },
  email: {
    type: DataTypes.TEXT
  },
  contact: {
    type: DataTypes.TEXT
  },
  id_number: {
    type: DataTypes.TEXT
  },
  password: {
    type: DataTypes.TEXT
  },
  avatar: {
    type: DataTypes.BLOB
  },
  status: {
    type: DataTypes.TEXT
  },
  web_device_id: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'user',
  timestamps: false
})

module.exports = User