const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    room_chat_id: String,
    content: String,
    images: Array,
    deleted: {
        type:Boolean,
        default: false
    },
    deleteAt: Date
},{
    timestamps: true
});

const Chat = mongoose.model("Chat",chatSchema,"Chat");
module.exports = Chat;