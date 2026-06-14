const productRouter = require("./product.route")
const homeRouter = require("./home.route")
const getCategoryMiddleWare = require("../../middlewares/client/getCategory.middleware");

module.exports = (app) => {
    app.use("/",getCategoryMiddleWare.getCategory,homeRouter)
    app.use("/products",productRouter)
}