const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Accounts = require("../../models/account.model");
const User = require("../../models/user.model");

module.exports.dashboard = async (req,res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        }
    };

    const user = res.locals.user;

    const products = await Product.find();
    statistic.product.total = products.length;
    products.forEach((item) => {
        if(item.active == "active") statistic.product.active+=1;
        else statistic.product.inactive+=1
    })

    const categoryProducts = await ProductCategory.find();
    statistic.categoryProduct.total = categoryProducts.length;
    categoryProducts.forEach((item) => {
        if(item.status == "active") statistic.categoryProduct.active+=1;
        else statistic.categoryProduct.inactive+=1;
    })

    const accounts = await Accounts.find();
    statistic.account.total = accounts.length;
    accounts.forEach((item) => {
        if(item.status == "active") statistic.account.active+=1;
        else statistic.account.inactive+=1;
    })

    const users = await User.find();
    statistic.user.total = users.length;
    users.forEach((item) => {
        if(item.status == "active") statistic.user.active+=1;
        else statistic.user.inactive+=1
    })

    console.log(statistic);

    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tổng quan",
        user: user,
        statistic: statistic
    });
}