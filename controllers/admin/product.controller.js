
const Product = require("../../models/product.model")
const filterStatus = require("../../helper/filterStatus")
const search = require("../../helper/search")
const pagination = require("../../helper/pagination")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const listButton = [
        {
            content: "Tất cả",
            status: "",
            class: ""
        },
        {
            content: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            content: "Không Hoạt Động",
            status: "inactive",
            class: ""
        }
    ]

    const query = {"delete": false}

    filterStatus(req.query,listButton,query)
    search(req.query,query)

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItems: 4
    }
    pagination(req.query,objectPagination,query)
    const countProduct = await Product.countDocuments(query);
    const totalPage = Math.ceil(countProduct/objectPagination.limitItems)
    objectPagination.totalPage = totalPage
    //End Pagination

    const products = await Product
        .find(query)
        .sort({"position" : "desc"})
        .limit(objectPagination.limitItems)
        .skip((objectPagination.currentPage-1)*4)
    
    res.render("admin/pages/products/index",{
        pageTitle: "Trang Sản Phẩm",
        products: products,
        button: listButton,
        currentPage: objectPagination.currentPage,
        totalPage: objectPagination.totalPage
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id},{active: status})

    req.flash('success','Cập nhật trạng thái sản phẩm thành công!!')

    const backUrl = req.get("Referer") || "/admin/products";
    
    res.redirect(backUrl)
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req,res) => {
    const ids = req.body.ids.split(",")
    const type = req.body.type;

    switch (type){
        case "delete":
            await Product.updateMany({_id : {$in : ids}},{"delete": true})
            req.flash('success','Bạn đã xoá sản phẩm thành công,sản phẩm sẽ được chuyển vào thùng rác!!')
            break;
        case "change-position":
            for(const item of ids){
                let [id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id : id},{"position": position})
            }
            req.flash('success','Cập nhật vị trí thành công!!')
            break;
        default:
            await Product.updateMany({_id: {$in: ids}},{"active": type})
            break;
    }
    
    const backUrl = req.get("Referer") || "/admin/products";

    res.redirect(backUrl)
}

// [DELETE] /admin/products/delete-product
module.exports.deleteProduct = async (req,res) => {
    const id = req.params.id;
    
    const result  = await Product.updateOne({_id: id},{"delete": true})

    req.flash('success','Bạn đã xoá sản phẩm thành công,sản phẩm sẽ được chuyển vào thùng rác!!')

    const backUrl = req.get("Referer") || "/admin/products";

    res.redirect(backUrl)
}

// [GET] /admin/products/trash-can
module.exports.trashCan = async (req,res) => {

    const products = await Product.find({"delete":true})

    res.render("admin/pages/trashCan/index",{
        products: products
    })
}

// [GET] /admin/products/trash-can/restore-product/:id

module.exports.restoreProduct = async (req,res) => {
    const id = req.params.id

    await Product.updateOne({_id : id},{delete: false})

    req.flash('success','Sản Phẩm Đã Được Khôi Phục!!')

    const backUrl = req.get("Referer") || "/admin/products";

    res.redirect(backUrl)
}

// [GET] /admin/products/create
module.exports.create = async (req,res) => {
    res.render("admin/pages/products/create",{
        pageTitle: "Thêm mới sản phẩm"}
    )
}
// [POST] /admin/products/create
module.exports.createPost = async (req,res) => {
    console.log(req.body)
    if(req.body){
        req.body.price = parseInt(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.quantity = parseInt(req.body.quantity)

        const productQuantity = await Product.countDocuments();
        req.body.position = productQuantity;

        const product = await Product.create(req.body)
        console.log(product)
        const backUrl = req.get("Referer") || "/admin/products";

        res.redirect(backUrl)
    }
    
}
