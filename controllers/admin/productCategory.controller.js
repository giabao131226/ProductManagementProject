const productCategory = require("../../models/product-category.model");

// [GET] "/product-category"
module.exports.index = async (req,res) => {
    const query = {"deleted": false}
    const category = await productCategory.find(query);
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
    const result = await productCategory.create(req.body);

    req.flash("success","Thêm mới danh mục thành công");
    res.redirect("/admin/product-category");
}