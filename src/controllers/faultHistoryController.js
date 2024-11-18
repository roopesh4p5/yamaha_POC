// /Users/roopeshvishwakarma/Pace/NODEJS/src/controllers/faultHistoryController.js
const FaultHistory = require('../models/faultHistory');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db');

exports.getAllFaultHistory = async (req, res) => {
  try {
      const faultHistory = await sequelize.query(`
      WITH uservalue AS (SELECT 10001::INT AS lower_bound, 40005::INT AS upper_bound) SELECT  cd.data_id, cd.resettable, cd.algorithm, cd.rec_history, cd.history_hold_type, cd.internal_fault_type_min, cd.internal_fault_type_max, cd.occurrence_type, pdt.product_id, pdt.per_product_uid, pdt.serial_no, pdt.mac_address, pdt.online_status, ldt.ip_address, ldt.device_label, ldt.device_id,ldt.firmware_version,ldt.invisible_fault_history_dev_uid FROM ( SELECT 
            data_id,
            CAST(resettable AS TEXT) AS resettable,
            CAST(algorithm AS TEXT) AS algorithm,
            NULL::TEXT AS rec_history,
            NULL::TEXT AS history_hold_type,
            NULL::TEXT AS internal_fault_type_min,
            NULL::TEXT AS internal_fault_type_max,
            NULL::TEXT AS occurrence_type
        FROM statistics_master
        WHERE data_id BETWEEN (SELECT lower_bound FROM uservalue) AND (SELECT upper_bound FROM uservalue)
        UNION ALL
        SELECT 
            data_id,
            NULL::TEXT AS resettable,
            NULL::TEXT AS algorithm,
            CAST(rec_history AS TEXT) AS rec_history,
            CAST(history_hold_type AS TEXT) AS history_hold_type,
            NULL::TEXT AS internal_fault_type_min,
            NULL::TEXT AS internal_fault_type_max,
            NULL::TEXT AS occurrence_type
        FROM sensing_data_master
        WHERE data_id BETWEEN (SELECT lower_bound FROM uservalue) AND (SELECT upper_bound FROM uservalue)
        UNION ALL
        SELECT 
            data_id,
            NULL::TEXT AS resettable,
            NULL::TEXT AS algorithm,
            NULL::TEXT AS rec_history,
            NULL::TEXT AS history_hold_type,
            CAST(internal_fault_type_min AS TEXT) AS internal_fault_type_min,
            CAST(internal_fault_type_max AS TEXT) AS internal_fault_type_max,
            CAST(occurrence_type AS TEXT) AS occurrence_type
        FROM fault_type_master
        WHERE data_id BETWEEN (SELECT lower_bound FROM uservalue) AND (SELECT upper_bound FROM uservalue)
    ) AS cd LEFT JOIN fault_history fh ON cd.data_id = fh.data_id 
     LEFT JOIN physical_device_table pdt ON fh.physical_device_uuid = pdt.physical_device_uuid 
     LEFT JOIN logical_device_table ldt ON fh.logical_device_id = ldt.logical_device_id
      `, {
        type: QueryTypes.SELECT
      });
      res.json(faultHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

exports.getFaultHistory = async (req, res) => {
  try {
   // Fetching data and ordering by 'history_id' in ascending order
    const faultHistory = await FaultHistory.findAll({
      order: [['history_id', 'ASC']]
    });
    res.json(faultHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};