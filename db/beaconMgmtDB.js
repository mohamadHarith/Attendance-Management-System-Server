const db = require('./config');

// //dummy data
// const dummyData = {
//     Name: 'BeaconFCI',
//     Address: '0A:BE:5C:09:10:12',
//     UUID: '12345678-abcd-88cc-abcd-1111aaaa2222',
//     Major: '324',
//     Minor: '574',
//     Venue_ID: 'CQCR3005'
// }

const setBeacon = async (beacon) => {
    try{
        return await db('Beacon').insert(beacon).returning('Name');
    }catch(e){
        throw new Error(e.message);
    }
}

const retrieveVenue = async()=>{
    try{
        return await db.select('Venue_ID').from('Venue');
    }catch(e){
        throw new Error(e.message);
    }
}

const retrieveBeacons = async()=>{
    try{
        return await db.select('*').from('Beacon');
    }catch(e){
        throw new Error(e.message);
    }
}

const deleteBeacon = async(beaconID)=>{
    try{   
        return await db('Beacon').where('Beacon_ID', beaconID).del()

    }catch(e){
        throw new Error(e.message);
    }
}

const getBeaconUUIDByVenue = async(venueID)=>{
    try{
        return await db.select('UUID', 'Venue_ID').from('Beacon').where('Venue_ID', venueID);
    }catch(e){
        throw new Error(e.message);
    }
}



// (async ()=>{ 
//     console.log(await retrieveBeacons());
// })();

module.exports={
    setBeacon,
    retrieveVenue,
    retrieveBeacons,
    deleteBeacon,
    getBeaconUUIDByVenue
}