const {beaconMgmtServices} = require('../services');

const assignBeacon = async (req,res)=>{
    try{
        const beacon = req.body;
        const insertedBeaconName = await beaconMgmtServices.assignBeacon(beacon);
        res.json(insertedBeaconName);
    }
    catch(e){
        console.log(e.message);
        res.status(500).json(e.message);
    }
}

const venues = async(req,res)=>{
    try{
        const venues = await beaconMgmtServices.getVenue();
        res.json(venues);
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);
    }
}

const beaconList = async(req, res)=>{
    try{
        const beacons = await beaconMgmtServices.getBeacons();
        res.json(beacons);
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);
    }
}

const removeBeacon = async(req, res)=>{
    try{
        const beaconID = req.params.beaconID;
        const isBeaconRemoved = await beaconMgmtServices.removeBeacon(beaconID);
        if(isBeaconRemoved){
            res.status(200).json('Beacon removed successfully');
        }
        else{
            throw new Error('Error! Beacon Could not be removed');
        }
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);
    }
}

const getBeaconUUIDByVenue = async(req, res)=>{
    try{
        
        const {venueID} = req.body;
        console.log('from beacon controller', req.body);
        
        const beaconUUID = await beaconMgmtServices.getBeaconUUIDByVenue(venueID);
        res.json(beaconUUID)
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);
    }
}

module.exports={
    assignBeacon, 
    venues,
    beaconList,
    removeBeacon,
    getBeaconUUIDByVenue
}