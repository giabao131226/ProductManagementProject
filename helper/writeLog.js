const ProductLog = require("../models/product-log.model");
const Product = require("../models/product.model.js");
const transHelper = require("./trans.js");

module.exports.writeLogProduct = async (action, id = null, data = null, user = null, status = null) => {
    try {
        switch (action) {
            case "DELETE": {
                const oldDataString = transHelper.changeObjectToString(data);
                data.delete = true;
                const newData = { ...data };
                const newDataString = transHelper.changeObjectToString(newData);

                const resultLog = await ProductLog.create({
                    "accountID": user._id,
                    "productID": data._id,
                    "action": "DELETE",
                    "oldData": oldDataString,
                    "newData": newDataString
                })
                break;
            }
            case "CREATE": {
                const stringLog = transHelper.changeObjectToString(data);
                const resultLog = await ProductLog.create({
                    "accountID": user._id,
                    "productID": data._id,
                    "action": "CREATE",
                    "newData": stringLog,
                    "oldData": null
                });
                break;
            }
            case "CHANGE STATUS": {
                const oldDataString = transHelper.changeObjectToString(data);
                data.active = status;
                const newData = {
                    ...data
                }
                const newDataString = transHelper.changeObjectToString(newData);

                const ansLog = await ProductLog.create({
                    "accountID": user._id,
                    "productID": id,
                    "action": "Change Status Product",
                    "oldData": oldDataString,
                    "newData": newDataString
                })
                break;
            }
            case "RESTORE": {
                const oldDataString = transHelper.changeObjectToString(data);
                data.delete = false;
                const newData = { ...data };
                const newDataString = transHelper.changeObjectToString(newData);

                const resultLog = await ProductLog.create({
                    "accountID": user._id,
                    "productID": data._id,
                    "action": "RESTORE",
                    "oldData": oldDataString,
                    "newData": newDataString
                })
                break;
            }
            default: break;
        }
    } catch (error) {
        console.log("Lỗi khi viết log cho Product: " + error);
    }
}
