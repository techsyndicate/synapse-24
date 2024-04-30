const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const driverSchema = new Schema({
    riders: {
        type: Array,
        required: true,
        default: []
    },
    driver: reqString,
    location: {
        type: Array,
        required: true
    },
    myLocation: {
        type: Array,
        required: true
    },
    vehicle: reqString,
    rideId: reqString,
    price: {
        type: Array,
        required: true,
        default: []
    },
    otp: reqString,
    distance: {
        type: Array,
        required: true
    },
    time: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("Ride", driverSchema)