const {
 DataTypes
} = require('sequelize');
const sequelize = require('../config/dbConnect.js');

const Txn = sequelize.define('txn', {
 id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  allowNull: false,
  primaryKey: true
 },
 qbCustomerRef: {
  type: DataTypes.INTEGER
 },
 qbId: {
  type: DataTypes.INTEGER,
 },
 totalAmount: {
  type: DataTypes.INTEGER,
 },
 qbCreateTime: {
  type: DataTypes.DATE,
 },
})

module.exports = Txn;