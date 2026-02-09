
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

    const query = {}

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

    const products = await Product.find(query).limit(objectPagination.limitItems).skip((objectPagination.currentPage-1)*4)
    
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

    const backUrl = req.get("Referer") || "/admin/products";
    
    res.redirect(backUrl)
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req,res) => {
    const ids = req.body.ids.split(",")
    const type = req.body.type;

    console.log(req.body.ids,req.body.type)

    const result = await Product.updateMany({_id: {$in: ids}},{"active": type})
    console.log(result)
    const backUrl = req.get("Referer") || "/admin/products";

    res.redirect(backUrl)
}