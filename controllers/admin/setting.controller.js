const SettingGeneral = require("../../models/setting-general.model");

// [GET] "/admin/setting/generals"
module.exports.generals = async (req,res) => {
    try{
        const result = await SettingGeneral.findOne();
        return res.render("admin/pages/setting/general",{
            setting: result
        });
    }catch(ex){
        console.log("Lỗi khi hiển thị trang cài đặt chung: "+ex);
    }
}

// [POST] "/admin/setting/generals"
module.exports.generalPost = async (req,res) => {
    try{
        const exist = await SettingGeneral.findOne({});
        if(exist){
            const result = await SettingGeneral.updateOne({"_id": exist._id},{...req.body});
        }else {
            const result = await SettingGeneral.create(req.body);
        }
        req.flash("success","Cập nhật thành công thông tin website");
        return res.redirect("/admin/setting/generals");
    }catch(ex){
        console.log("Lỗi khi cập nhật cài đặt chung: "+ex);
    }
}
