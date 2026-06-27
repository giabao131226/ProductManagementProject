const productRouter = require("./product.route")
const homeRouter = require("./home.route")
const getCategoryMiddleWare = require("../../middlewares/client/getCategory.middleware");
const cartRouter = require("./cart.route");

module.exports = (app) => {
    app.use("/",getCategoryMiddleWare.getCategory,homeRouter)
    app.use("/products",productRouter)
    app.use("/cart",cartRouter)
}