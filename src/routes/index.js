// /Users/roopeshvishwakarma/Pace/NODEJS/src/routes/index.js
const express = require('express');
const router = express.Router();
const faultHistoryController = require('../controllers/faultHistoryController');
const syncMetaController = require('../controllers/syncMetaController');

router.get('/fault-history', faultHistoryController.getFaultHistory);

router.get('/fault-history-all', faultHistoryController.getAllFaultHistory);



router.get('/sync-meta', syncMetaController.getSyncMetatable);

router.get('/update-sync-meta', syncMetaController.updateSyncMeta);
router.get('/', function (req,res){
    res.send('Hello world!')
})

module.exports = router;


