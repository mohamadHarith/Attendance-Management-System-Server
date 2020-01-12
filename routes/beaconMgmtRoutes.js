const express = require('express');
const {beaconMgmtController} = require('../controllers');

const router = express.Router();

router.post('/assignBeacon', beaconMgmtController.assignBeacon);
router.get('/venues', beaconMgmtController.venues);
router.get('/beaconList', beaconMgmtController.beaconList);
router.get('/beaconList/removeBeacon/:beaconID', beaconMgmtController.removeBeacon);
router.post('/getBeaconUUID', beaconMgmtController.getBeaconUUIDByVenue);


module.exports = router;