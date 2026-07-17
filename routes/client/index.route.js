const productRouter = require("./product.route")
const homeRouter = require("./home.route")
const getCategoryMiddleWare = require("../../middlewares/client/getCategory.middleware");
const cartRouter = require("./cart.route");
const blogRouter = require("./blog.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const chatRouter = require("./chat.route");
const userMiddleware = require("../../middlewares/user.midleware");
const settingMiddleware = require("../../middlewares/setting-general.middlewares");
const authorization = require("../../middlewares/authorization.middleware");


module.exports = (app) => {
    app.use(userMiddleware.userInfo);
    app.use(settingMiddleware.getSettingGenerals);
    app.use("/",getCategoryMiddleWare.getCategory,homeRouter)
    app.use("/products",productRouter)
    app.use("/cart",cartRouter)
    app.use("/blog",blogRouter)
    app.use("/checkout",checkoutRouter)
    app.use("/user",userRouter)
    app.use("/chat",chatRouter)
}