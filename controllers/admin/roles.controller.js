const Roles = require("../../models/roles.model");
// [GET] "/roles/"
module.exports.index = async (req,res) => {
    const find = {
        deleted: false
    }
    const listRoles = await Roles.find(find).lean();
    res.render("admin/pages/roles/index.pug",{
        roles: listRoles
    });
}

// [GET] "/roles/create"
module.exports.create = async (req,res) => {
    res.render("admin/pages/roles/create.pug");
}


// [POST] "/roles/create"
module.exports.createRole = async (req,res) => {
    const data = req.body;
    try{
        const result = await Roles.create(data);
        if(result){
            req.flash("success","Thêm mới nhóm quyền thành công");
            return res.redirect("/admin/roles");
        }
        req.flash("error","Thê mới nhóm quyền không thành công");
    }catch(error){
        console.log(error);
    }
}

// [DELETE] /roles/delete/:id
module.exports.deleteRole = async (req,res) => {
    const id = req.params.id;
    if(id){
        try{
            const result = await Roles.deleteOne({"_id": id});
            if(result.deletedCount > 0){
                res.redirect("/admin/roles");
            }
        }catch(error){
            console.log(error);
        }
    }
}

// [GET] /roles/edit/:id
module.exports.edit = async (req,res) => {
    const id = req.params.id;
    if(id){
        const data = await Roles.findOne({"_id": id});
        res.render("admin/pages/roles/edit.pug",{
            roleDetail: data
        })
    }
}

// [PATCH] /roles/edit/:id
module.exports.editPatch = async (req,res) => {
    const id = req.params.id;
    if(id){
        const data = req.body;
        if(data.title.length == 0){
            return req.flash("error","Cập nhật nhóm quyến không thành công");
        }
        const result = await Roles.updateOne({"_id": id},{
            ...data
        })

        req.flash("success","Cập nhật nhóm quyến thành công");
        res.redirect("/admin/roles")
    }
}

// [GET] /roles/permissions
module.exports.permissions = async (req,res) => {
    try{
        const find = {
            deleted: false
        }
        const roles = await Roles.find(find);
        res.render("admin/pages/roles/permissions",{
            roles: roles
        })
    }catch(error){
        console.log("Lỗi load permissions: ",error);
    }
}

// [PATCH] /roles/permissions
module.exports.permissionsPatch = async (req,res) => {
    const data = JSON.parse(req.body.roles);
    try{
        data.forEach(async (item) => {
            await Roles.updateOne({"_id": item.id},{permissions: item.permissions});
        })
        res.redirect("/admin/roles/permissions");
    }catch(error){
        console.log("Lỗi khi cập nhật quyền",error);
    }

}
