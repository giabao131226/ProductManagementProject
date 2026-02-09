
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({})
    res.render("client/pages/products/index",{
        pageTitle: "Trang Sản Phẩm",
        products: products
    })
}