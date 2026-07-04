const productRouter = require("./product.route")
const homeRouter = require("./home.route")
const getCategoryMiddleWare = require("../../middlewares/client/getCategory.middleware");
const cartRouter = require("./cart.route");
const blogRouter = require("./blog.route");
const checkoutRouter = require("./checkout.route");

module.exports = (app) => {
    app.use("/",getCategoryMiddleWare.getCategory,homeRouter)
    app.use("/products",productRouter)
    app.use("/cart",cartRouter)
    app.use("/blog",blogRouter)
    app.use("/checkout",checkoutRouter)
}