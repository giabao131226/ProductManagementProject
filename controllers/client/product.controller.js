
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({}).sort({"position":"desc"})
    res.render("client/pages/products/index",{
        pageTitle: "Trang Sản Phẩm",
        products: products
    })
}

module.exports.detailProduct = async (req,res) => {
    const id = req.params.id

    const detailProduct = await Product.findOne({_id: id})

    res.render("client/pages/products/detail",{Product: detailProduct})
}