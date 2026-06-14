const productCategory = require("../../models/product-category.model");
const mongoose = require("mongoose");
const createTree = require("../../helper/createTree");

// [GET] "/product-category"
module.exports.index = async (req,res) => {
    const query = {"deleted": false}

    function createTree(arr,parentID){
        const tree = [];
        arr.forEach((item) => {
            if(item.parent_id == parentID){
                const currentNode = {...item};
                const children = createTree(arr,item.id);
                if(children.length > 0){
                    currentNode.children = children;
                }
                tree.push(currentNode);
            }
        })
        return tree;
    }

    const category = await productCategory.find(query).lean();
    const categoryTree = createTree(category,"");
    
    res.render("admin/pages/productCategory/index.pug",{
        category: category
    })
}

// [GET] "/product-category/create"
module.exports.create = async (req,res) => {
    const find = {deleted: false}

    function createTree(arr,parentID){
        const tree = [];
        arr.forEach((item) => {
            if(item.parent_id == parentID){
                const currentNode = {...item};
                const children = createTree(arr,item.id);
                if(children.length > 0){
                    currentNode.children = children;
                }
                tree.push(currentNode);
            }
        })
        return tree;
    }

    const records = await productCategory.find(find);
    const category = createTree(records,"");

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
    const records = await productCategory.find(find);
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
