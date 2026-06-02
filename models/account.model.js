const mongoose = require("mongoose");
const accountSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    token: String,
    role_id: {
        type: new mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        default: null
    },
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updateAt"
    }
})

const Accounts = mongoose.model("Accounts",accountSchema,"Accounts");
module.exports = Accounts;