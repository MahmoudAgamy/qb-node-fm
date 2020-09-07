const {
 DataTypes
} = require('sequelize');
var sequelize = require('../config/dbConnect.js');

const Txn = sequelize.define('txn', {
 id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  allowNull: false,
  primaryKey: true
 },
 value: {
  type: DataTypes.INTEGER
 }
})

module.exports = Txn;