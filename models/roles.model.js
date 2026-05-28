const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({
    title: String,
    permissions: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
},{
        timestamps: true
})

const Roles = mongoose.model("Roles",roleSchema,"Roles");

module.exports = Roles;
