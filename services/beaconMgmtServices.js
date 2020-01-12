const {beaconMgmtDB} = require('../db');

// //dummy data
// const dummyData = {
//     Name: 'BeaconFCI',
//     Address: '0A:BE:5C:09:10:12',
//     UUID: '12345678-abcd-88cc-abcd-1111aaaa2222',
//     Major: '324',
//     Minor: '574',
//     Venue_ID: 'CQCR3005'
// }

//takes the beacon object as parameter and passes it to the DB layer 
//to be inserted into database. Returns the beacon name of the inserted beacon.
const assignBeacon = async (beacon)=>{
    try{
        const insertedBeaconName = await beaconMgmtDB.setBeacon(beacon);
        if(insertedBeaconName.length > 0){
            return insertedBeaconName;
        }
        else{
            throw new Error('Could not assign Beacon');
        }
    }catch(e){
        throw new Error(e.message);
    }
} 

const getVenue = async()=>{
    try{
        const venues = await beaconMgmtDB.retrieveVenue();
        if(venues.length > 0){
            return venues;
        }
        else{
            throw new Error('Could not get venues');
        }

    }catch(e){
        throw new Error(e.message);
    }
}

const getBeacons = async()=>{
    try{
        const beacons = await beaconMgmtDB.retrieveBeacons();
        if(beacons.length > 0){
            return beacons;
        }
        else{
            throw new Error('Could not get beacons');
        }
    }catch(e){
        throw new Error(e.message);
    }
}

const removeBeacon = async(beaconID)=>{
    try{
        const isBeaconRemoved = await beaconMgmtDB.deleteBeacon(beaconID) > 0;
        return isBeaconRemoved;

    }catch(e){
        throw new Error(e.message);
    }
}

const getBeaconUUIDByVenue = async(venueID)=>{
    try{
        const beaconUUID = await beaconMgmtDB.getBeaconUUIDByVenue(venueID);
        if(beaconUUID.length>0){
            return beaconUUID;
        }
        else{
            throw new Error('Beacon not assigned for the venue.');
        }
    }catch(e){
        throw new Error(e.message);
    }
}

// (async()=>{console.log(await removeBeacon(61))})();

module.exports = {
    assignBeacon,
    getVenue,
    getBeacons,
    removeBeacon,
    getBeaconUUIDByVenue
}