// /Users/roopeshvishwakarma/Pace/NODEJS/src/controllers/syncMetaController.js
const { QueryTypes } = require('sequelize');
const sequelize = require('../db');
const SyncMeta = require('../models/syncMeta');

// Helper function to get the latest sync ID based on `data_type`
const getLatestSyncId = async (data_type) => {
  try {
    let query;
    switch (data_type) {
      case 'sensing_data':
        query = 'SELECT COALESCE(MAX(sensing_history_id), 0) AS max_id FROM sensing_history';
        break;
      case 'fault_history':
        query = 'SELECT COALESCE(MAX(history_id), 0) AS max_id FROM fault_history';
        break;
      default:
        return 0;
    }

    const [result] = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    return result.max_id;
  } catch (error) {
    console.error(`Error getting latest sync ID for ${data_type}:`, error);
    return 0;
  }
};

// Helper function to update `sync_meta` table
const updateSyncMetaHelper = async (data_type = null) => {
  try {
    let syncTypes = data_type ? [data_type] : ['sensing_data', 'fault_history'];
    let updateCount = 0;

    for (const type of syncTypes) {
      // Get the latest sync ID from corresponding table
      const latestSyncId = await getLatestSyncId(type);

      // Update using raw query to ensure it works
      const [result] = await sequelize.query(
        `UPDATE sync_meta 
         SET last_sync_id = :latestSyncId 
         WHERE data_type = :data_type`,  // Changed `sensing_type` to `data_type`
        {
          replacements: { 
            latestSyncId,
            data_type: type  // Changed `sensing_type` to `data_type`
          },
          type: QueryTypes.UPDATE
        }
      );

      updateCount += result;
    }

    return {
      success: true,
      message: 'Database updated successfully',
      updatedCount: updateCount
    };

  } catch (error) {
    console.error('Error in updateSyncMetaHelper:', error);
    return {
      success: false,
      message: 'Error updating sync meta data',
      error: error.message
    };
  }
};

// API endpoint for updating sync meta
exports.updateSyncMeta = async (req, res) => {
  try {
    const { data_type } = req.query;
    const result = await updateSyncMetaHelper(data_type);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in updateSyncMeta:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating sync meta data',
      error: error.message 
    });
  }
};

// API endpoint to fetch `sync_meta` table
exports.getSyncMetatable = async (req, res) => {
  try {
    const { data_type } = req.query;
    await updateSyncMetaHelper(data_type);

    const syncMetaData = await sequelize.query(
      `SELECT * FROM sync_meta`,
      {
        type: QueryTypes.SELECT
      }
    );

    res.json({ 
      success: true, 
      data: syncMetaData 
    });
  } catch (error) {
    console.error("Error fetching sync_meta data:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching data", 
      error: error.message 
    });
  }
};

// Initialize `sync_meta` table with initial data
exports.initializeSyncMeta = async () => {
  try {
    await sequelize.query(`
      INSERT INTO sync_meta (id, data_type, last_sync_id)
      VALUES 
        (1, 'sensing_data', 0),
        (2, 'fault_history', 0)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('SyncMeta initialization completed');
  } catch (error) {
    console.error('Error initializing SyncMeta:', error);
  }
};


