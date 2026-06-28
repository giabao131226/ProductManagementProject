const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helper/product");

// [GET] "/"
module.exports.index = async (req,res) => {
    try{
        const products = await Product.find({"delete": false,"active":'active','featured':true}).lean();
        const listProduct = products.map((item) => {
            item.price = productHelper.formatMoney(item.price);
            return {...item};
        })
        return res.render("client/pages/home/index",{
            pageTitle: "Trang chủ",
            products: listProduct
        })
    }catch(error){
        console.log("Lỗi khi hiển thị trang chủ: "+error);
    }
}

// [GET] "/:slugProduct"
module.exports.detailProduct = async (req,res) => {
    try{
        const slug = req.params.slugProduct;
        console.log(slug);
        const productDetail = await Product.findOne({"slug": slug,"delete": false,"active": 'active'}).lean();
        const productCategory = await ProductCategory.findOne({"_id": productDetail.categoryID}).lean();
        productDetail.category = productCategory;
        productDetail.price = productHelper.formatMoney(productDetail.price);
        return res.render("client/pages/products/detail",{Product: productDetail});
    }catch(ex){
        console.log("Lỗi khi hiển thị chi tiết sản phẩm bên client: "+ex);
    }
}

// [GET] "/search"
module.exports.search = async (req,res) => {
    try{
        const keyword = req.query.keyword;
        const products = await Product.find({title: {
                $regex: keyword,
                $options: "i"
            }});
        return res.render("client/pages/home/search",{
                pageTitle: "Kết quả tìm kiếm "+keyword,
                products: products});
    }catch(ex){
        console.log("Lỗi khi tìm kiếm sản phẩm: "+ex);
    }
}