// /Users/roopeshvishwakarma/Pace/NODEJS/src/models/faultHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FaultHistory = sequelize.define('FaultHistory', {
  history_id: {
    type: DataTypes.BIGINT,  
    primaryKey: true,
    autoIncrement: true, 
  },
  physical_device_uuid: {
    type: DataTypes.INTEGER,  
  },
  logical_device_id: {
    type: DataTypes.INTEGER,
  },
  history_dev_uid: {
    type: DataTypes.BIGINT, 
  },
  data_id: {
    type: DataTypes.BIGINT,
  },
  internal_fault_type: {
    type: DataTypes.INTEGER,
  },
  channel: {
    type: DataTypes.BIGINT,
  },
  abs_time: {
    type: DataTypes.STRING(30),
  },
  rel_time: {
    type: DataTypes.STRING(30),
  },
  severity: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING(2),
  },
  count: {
    type: DataTypes.INTEGER,
  },
  supplement: {
    type: DataTypes.STRING(128),
  }
}, {
  tableName: 'fault_history', 
  // freezeTableName:true,
  timestamps: false,
});

module.exports = FaultHistory;


