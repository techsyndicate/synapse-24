const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new Schema({
    fname: reqString,
    lname: reqString,
    email: reqString,
    password: reqString,
    points: {
        type: Number,
        required: true,
        default: 0
    },
    carbonEmissions: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        required: true,
        default: "User"
    }
})

module.exports = mongoose.model("User", userSchema)