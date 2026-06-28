const systemConfig = require("../../config/system")
const homeRoutes = require("./home.route")
const dashboardRoutes = require("./dashboard.route")
const productsRoutes = require("./products.route")
const productCategoryRoute = require("./productCategory.route")
const roleRouter = require("./roles.route");
const accountRouter = require("./accounts.route");
const authRouter = require("./auth.routes");
const blogRouter = require("./blog.routes");
const uploadRouter = require("./upload.route");
const middlewareAuth = require("../../middlewares/authentication.middlewares");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixpath

    app.use(PATH_ADMIN,homeRoutes)
    app.use(PATH_ADMIN+"/dashboard",middlewareAuth.auth,dashboardRoutes)
    app.use(PATH_ADMIN+"/products",middlewareAuth.auth,productsRoutes)
    app.use(PATH_ADMIN+"/product-category",middlewareAuth.auth,productCategoryRoute)
    app.use(PATH_ADMIN+"/roles",middlewareAuth.auth,roleRouter)
    app.use(PATH_ADMIN + "/accounts",middlewareAuth.auth,accountRouter)
    app.use(PATH_ADMIN + "/auth",authRouter)
    app.use(PATH_ADMIN +"/blogs",middlewareAuth.auth,blogRouter)
    app.use(PATH_ADMIN + "/upload",uploadRouter)
}