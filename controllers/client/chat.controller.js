const Chat = require("../../models/chat.model");

// [GET] "/chat/:roomChatID"
module.exports.chat = async (req, res) => {
    const roomChatID = req.params.roomChatID;

    const find = {
        "deleted": false
    }
    if(roomChatID) find.room_chat_id = roomChatID;

    const user = res.locals.user;

    const chats = await Chat.find(find)
        .sort([["createdAt", "desc"]])
        .limit(10)
        .populate({
            path: "user_id",
            select: "avatar fullName _id"
        });
    chats.reverse();

    return res.render("client/pages/chat/index.pug", {
        user: user,
        chats: chats,
        roomChatID: roomChatID
    });
}