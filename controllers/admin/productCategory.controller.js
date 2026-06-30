const productCategory = require("../../models/product-category.model");
const mongoose = require("mongoose");
const createTree = require("../../helper/createTree");
const pagination = require("../../helper/pagination")

// [GET] "/product-category"
module.exports.index = async (req,res) => {
    const query = {"deleted": false};
    const page = req.query.page || 1;

    const status = req.query.status;
    if(status && status != "all"){
        query.status = status;
    }
    const keyword = req.query.keyword || "";
    if(keyword){
        query.title = { $regex: keyword, $options: "i" }
    }
    const key = req.query.key || "position";
    const sortValue = req.query.sortValue || "asc";

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItems: 4
    }
    pagination(req.query, objectPagination, query)
    const countProductCategory = await productCategory.countDocuments(query);
    const totalPage = Math.ceil(countProductCategory / objectPagination.limitItems)
    objectPagination.totalPage = totalPage
    //End Pagination
        
    const button = [
        {
            "title": "Tất Cả",
            "value": "all"
        },
        {
            "title": "Hoạt Động",
            "value": "active"
        },
        {
            "title": "Không Hoạt Động",
            "value": "in-active"
        }
    ]

    const category = await productCategory.find(query).lean().sort({[key]: sortValue}).skip((page-1)*objectPagination.limitItems).limit(objectPagination.limitItems);
    const treeCategory = createTree.getTree(category,"");

    res.render("admin/pages/productCategory/index.pug",{
        pageTitle: "Danh Mục Sản Phẩm",
        category: treeCategory,
        button: button,
        keyword: keyword,
        status: status,
        currentPage: objectPagination.currentPage,
        totalPage: objectPagination.totalPage,
    })
}

// [GET] "/product-category/create"
module.exports.create = async (req,res) => {
    const find = {deleted: false}

    const records = await productCategory.find(find).lean();
    const category = createTree.getTree(records,"");

    res.render(
        "admin/pages/productCategory/create.pug",
        {
            "category": category
        })
}

// [POST] "/product-category/create"
module.exports.createPost = async (req,res) => {
    if(!req.body.title){
        return;
    }
    if(!req.body.position){
        const count = await productCategory.countDocuments();
        req.body.position = count;
    }
    req.body.status = "active";
    if(!req.body.parent_id){
        req.body.parent_id = "";
    }
    const result = await productCategory.create(req.body);
    req.flash("success","Thêm mới danh mục thành công");
    res.redirect("/admin/product-category");
}

// [POST] "/product-category/delete/:id"

module.exports.delete = async (req,res) => {
    const id = req.params.id;
    const data = await productCategory.updateOne({_id:id},{deleted: true});
    req.flash("success","Xoá sản phẩm thành công");
    res.redirect("/admin/product-category");
}

// [GET] "/product-category/edit/:id"
module.exports.edit = async (req,res) => {
    const id = req.params.id;
    const data = await productCategory.findById( new mongoose.Types.ObjectId(req.params.id)).lean();

    const find = {deleted: false}
    const records = await productCategory.find(find).lean();
    const category = createTree.getTree(records,"");
    res.render("admin/pages/productCategory/edit",{
        "pageTitle": "Chỉnh sửa sản phẩm",
        "data": data,
        "category": category
    });
}
// [PATCH] "/product-category/edit/:id"
module.exports.editPatch = async (req,res) => {
    const id = req.params.id;
    if(!req.body.title) return;
    if(!req.body.possition){
        const count = await productCategory.countDocuments();
        req.body.position = count;
    }
    if(!req.body.parent_id){
        req.body.parent_id = "";
    }
    let url = "";
    if(req.body.thumbnail){
        url = req.body.thumbnail
    }

    const result = await productCategory.updateOne({"_id": id},{
        "title": req.body.title,
        "parent_id": req.body.parent_id,
        "status": req.body.status,
        "position": req.body.possition,
        "deleted": req.body.deleted,
        "thumbnail": url,
        "status": req.body.status
    })
    
    req.flash("success","Chỉnh sửa sản phẩm thành công");
    res.redirect("/admin/product-category");
}
// [PATCH] "/product-category/change-status/:status/:id"
module.exports.changeStatus = async (req,res) => {
    try{
        const id = req.params.id;
        const status = req.params.status;

        const result = await productCategory.updateOne({"_id":id},{"status": status});
        req.flash("success","Cập Nhật Trạng Thái Thành Công");
        res.redirect("/admin/product-category");

    }catch(error){
        console.log("Lỗi khi thay đổi trạng thái danh mục sản phẩm: "+error);
    }
}
