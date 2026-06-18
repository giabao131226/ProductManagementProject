
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

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

// [GET] "/products/:slugProductCategory"
module.exports.productWithCategory = async (req,res) => {
    try{
        const slugProduct = req.params.slugProductCategory;
        const category = await ProductCategory.findOne({"deleted": false,"slug":slugProduct});
        async function getSub(parent_id){
            const arr = [parent_id];
            const categories = await ProductCategory.find({"deleted": false,"parent_id": parent_id});
            const childs = await Promise.all(categories.map(async (item) => {
                const children = await getSub(item._id);
                return children;
            }))
            arr.push(...childs.flat());
            return arr;
        }
        const listCategory = await getSub(category._id);
        console.log(listCategory);

        const products = await Product.find({"delete": false,"categoryID": {$in: listCategory}}).limit(6);

        return res.render("client/pages/products/index",{
        pageTitle: "Danh Mục",
        products: products
    })
    }catch(error){
        console.log("Lỗi khi truy vấn sản phẩm theo danh mục: "+error);
    }
}