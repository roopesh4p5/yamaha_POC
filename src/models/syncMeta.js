// /Users/roopeshvishwakarma/Pace/NODEJS/src/models/syncMeta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SyncMeta = sequelize.define('SyncMeta', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  data_type: {  // Use `data_type` instead of `sensing_type`
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_sync_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  last_sync_time: {  // Timestamp column for tracking last sync time
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  overflow: {  // Overflow column with BIGINT type
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: 'sync_meta',
  timestamps: false
});

module.exports = SyncMeta;

