const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const driverSchema = new Schema({
    name: reqString,
    email: reqString,
    kyc: reqString
})

module.exports = mongoose.model("Drivers", driverSchema)