const SettingGeneral = require("../models/setting-general.model");

module.exports.getSettingGenerals = async (req,res,next) =>{
    try{
        const setting = await SettingGeneral.findOne({});
        res.locals.setting = setting;
        next();
    }catch(ex){
        console.log("Lỗi trong middlewares lấy setting general: "+ex);
    }
}