const mongoose = require("mongoose");
const settingGeneralSchema = mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
},{
    timestamps: true
});

const SettingGeneral = mongoose.model("SettingGeneral",settingGeneralSchema,"Setting-General");

module.exports = SettingGeneral;