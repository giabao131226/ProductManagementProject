const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const ProductLog = require("../../models/product-log.model");
const filterStatus = require("../../helper/filterStatus")
const search = require("../../helper/search")
const pagination = require("../../helper/pagination")
const transHelper = require("../../helper/trans");
const WriteLog = require("../../helper/writeLog");
const treeHelper = require("../../helper/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const listButton = [
        {
            content: "Tất cả",
            status: "",
            class: ""
        },
        {
            content: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            content: "Không Hoạt Động",
            status: "inactive",
            class: ""
        }
    ]

    const query = { "delete": false }

    filterStatus(req.query, listButton, query)
    search(req.query, query)

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItems: 4
    }
    pagination(req.query, objectPagination, query)
    const countProduct = await Product.countDocuments(query);
    const totalPage = Math.ceil(countProduct / objectPagination.limitItems)
    objectPagination.totalPage = totalPage
    //End Pagination

    // Sort
    const keySort = req.query.key || "position"
    const valueSort = req.query.sortValue ? req.query.sortValue : "asc"
    // End Sort

    const products = await Product
        .find(query)
        .sort({ [keySort]: valueSort })
        .limit(objectPagination.limitItems)
        .skip((objectPagination.currentPage - 1) * 4)

    res.render("admin/pages/products/index", {
        pageTitle: "Trang Sản Phẩm",
        products: products,
        button: listButton,
        currentPage: objectPagination.currentPage,
        totalPage: objectPagination.totalPage,
        keyAndValueSort: keySort + "-" + valueSort
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        const oldData = await Product.findOne({ "_id": id });

        await Product.updateOne({ _id: id }, { active: status });

        const user = res.locals.user;
        await WriteLog.writeLogProduct("CHANGE STATUS", id, oldData.toObject(), user, status)

        req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!!')
        const backUrl = req.get("Referer") || "/admin/products";
        res.redirect(backUrl)
    } catch (error) {
        console.log("Lỗi khi cập nhật trạng thái hoạt động của sản phẩm: " + error);
        return res.redirect("/admin/products");
    }
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",")
    const type = req.body.type;
    const user = res.locals.user;
    switch (type) {
        case "delete": {
            const listProduct = await Product.find({ "_id": { $in: ids } });
            await Product.updateMany({ _id: { $in: ids } }, { "delete": true });
            await Promise.all(listProduct.map(async (item) => {
                await WriteLog.writeLogProduct("DELETE", null, item.toObject(), user);
            }))
            req.flash('success', 'Bạn đã xoá sản phẩm thành công,sản phẩm sẽ được chuyển vào thùng rác!!')
            break;
        }
        case "change-position": {
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({ _id: id }, { "position": position })
            }
            req.flash('success', 'Cập nhật vị trí thành công!!')
            break;
        }
        default:
            const listProduct = await Product.find({ "_id": { $in: ids } });
            await Product.updateMany({ _id: { $in: ids } }, { "active": type });
            await Promise.all(listProduct.map(async (item) => {
                await WriteLog.writeLogProduct("CHANGE STATUS", item._id, item.toObject(), user, type);
            }));
            break;
    }

    const backUrl = req.get("Referer") || "/admin/products";
    res.redirect(backUrl)
}

// [DELETE] /admin/products/delete-product
module.exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const oldData = await Product.findOne({ "_id": id });
        const result = await Product.updateOne({ _id: id }, { "delete": true })
        const user = res.locals.user;
        await WriteLog.writeLogProduct("DELETE", id, oldData.toObject(), user);

        req.flash('success', 'Bạn đã xoá sản phẩm thành công,sản phẩm sẽ được chuyển vào thùng rác!!')
        const backUrl = req.get("Referer") || "/admin/products";
        return res.redirect(backUrl)
    } catch (error) {
        console.log("Lỗi khi xoá sản phẩm: " + error);
        req.flash("error", error)
        return res.redirect("/admin/products");
    }
}

// [GET] /admin/products/trash-can
module.exports.trashCan = async (req, res) => {

    const products = await Product.find({ "delete": true })

    res.render("admin/pages/trashCan/index", {
        products: products
    })
}

// [GET] /admin/products/trash-can/restore-product/:id
module.exports.restoreProduct = async (req, res) => {
    const id = req.params.id

    const oldData = await Product.findOne({ "_id": id });

    await Product.updateOne({ _id: id }, { delete: false })
    const user = res.locals.user;
    await WriteLog.writeLogProduct("RESTORE", id, oldData.toObject(), user);

    req.flash('success', 'Sản Phẩm Đã Được Khôi Phục!!')
    const backUrl = req.get("Referer") || "/admin/products";
    res.redirect(backUrl)
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    try {
        const productCategory = await ProductCategory.find({"deleted": false}).lean();
        const treeCategory = await treeHelper.getTree(productCategory,'');
        return res.render("admin/pages/products/create", {
            pageTitle: "Thêm mới sản phẩm",
            treeCategory: treeCategory
        })

    } catch (error) {
        console.log("Lỗi khi hiển thị trang tạo sản phẩm: " + error);
    }
}
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    try {
        if (!req.body.title.trim()) {
            req.flash("error", "Bạn Phải Nhập Đầy Đủ Thông Tin Đã");
            return res.redirect("/admin/products");
        }

        if (req.body.price) req.body.price = parseInt(req.body.price)
        if (req.body.discountPercentage) req.body.discountPercentage = parseInt(req.body.discountPercentage)
        if (req.body.quantity) req.body.quantity = parseInt(req.body.quantity)
        req.body.delete = false;
        if (!req.body.position) {
            const productQuantity = await Product.countDocuments();
            req.body.position = productQuantity;
        }

        const result = await Product.create(req.body);
        await WriteLog.writeLogProduct("CREATE", null, result.toObject(), res.locals.user)

        req.flash("success", "Bạn đã thêm sản phẩm thành công")
        return res.redirect("/admin/products")
    } catch (error) {
        console.log("Lỗi khi tạo mới sản phẩm: " + error);
        req.flash("error", "Không thể tạo mới sản phẩm. Vui lòng thử lại");
        return res.redirect("/admin/products/create");
    }
}

// [GET] /admin/products/edit/:id
module.exports.editProducts = async (req, res) => {
    const id = req.params.id;
    const productDetail = await Product.findOne({ "_id": id });
    const productCategory = await ProductCategory.find({"deleted": false,"status": 'active'}).lean();
    const treeCategory = await treeHelper.getTree(productCategory,'');
    res.render("admin/pages/products/edit", {
        productDetail: productDetail,
        treeCategory: treeCategory
    })
}

// [PATCH] /admin/products/edit/:id
module.exports.editProductPatch = async (req, res) => {
    try {
        const backUrl = req.get("Referer") || `/admin/products/edit${req.params.id}`
        const id = req.params.id
        if (!req.body.title.trim()) {
            req.flash("error", "Bạn phải nhập đầy đủ thông tin");
            return res.redirect("/admin/products");
        }
        const oldDetail = await Product.findOne({ "_id": id })

        if (req.body.price) req.body.price = parseInt(req.body.price)
        if (req.body.discountPercentage) req.body.discountPercentage = parseInt(req.body.discountPercentage)
        if (req.body.quantity) req.body.quantity = parseInt(req.body.quantity)
        if(req.body.featured == 'value') req.body.featured = true;
        else req.body.featured = false;
        const oldDataString = transHelper.changeObjectToString(oldDetail.toObject());

        await Product.updateOne({ _id: id }, {
            $set: {
                title: `${req.body.title.trim()}`,
                des: `${req.body.des}`,
                thumbnail: `${req.file ? req.body.thumbnail : oldDetail.thumbnail}`,
                price: `${req.body.price || oldDetail.price}`,
                active: `${req.body.active}`,
                categoryID: req.body.categoryID,
                featured: req.body.featured,
                quantity: req.body.quantity,
                description: req.body.description
            }
        })
        oldDetail.title = req.body.title;
        oldDetail.des = req.body.des;
        oldDetail.thumbnail = req.file ? req.body.thumbnail : oldDetail.thumbnail;
        oldDetail.price = req.body.price;
        oldDetail.active = req.body.active;
        oldDetail.categoryID = req.body.categoryID;
        oldDetail.featured = req.body.featured;
        oldDetail.quantity = req.body.quantity;
        oldDetail.description = req.body.description;

        const newData = { ...oldDetail };
        const newDataString = transHelper.changeObjectToString(newData._doc);
        const user = res.locals.user;

        const resultLog = await ProductLog.create({
            "accountID": user._id,
            "productID": id,
            "action": "EDIT",
            "oldData": oldDataString,
            "newData": newDataString
        })

        req.flash("success", "Cập nhật thông tin sản phẩm thành công");
        return res.redirect("/admin/products");
    } catch (error) {
        console.log("Lỗi khi cập nhật sản phẩm: " + error);
        req.flash("error", "Lỗi khi cập nhật sản phẩm");
        return res.redirect(`/admin/product/edit/${req.params.id}`);
    }
}

// [GET] /admin/products/detail/:id
module.exports.detailProduct = async (req, res) => {
    const id = req.params.id;

    const detailProduct = await Product.findOne({ _id: id });

    res.render("admin/pages/products/detail", {
        Product: detailProduct
    })
}
