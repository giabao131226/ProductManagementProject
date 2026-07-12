const mongoose = require("mongoose");
const otpSchema = mongoose.Schema({
    email: String,
    otp: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180
    }
})

const OTP = mongoose.model("OTP",otpSchema,"OTP");
module.exports = OTP;