const Chat = require("../../models/chat.model");
// const uploadImage = require("../../helper/uploadImage");
// const indexSocket = require("../../socket/index.socket");

// [GET] "/chat"
module.exports.chat = async (req, res) => {
    const user = res.locals.user;
    const chats = await Chat.find({}).sort([
        ["createdAt", "desc"]
    ]).limit(10).populate({
        path: "user_id",
        select: "avatar fullName _id"
    });
    chats.reverse();
    return res.render("client/pages/chat/index.pug", {
        user: user,
        chats: chats
    });
}