const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/roomchat.model");

// [GET] "/chat/:roomChatID"
module.exports.chat = async (req, res) => {
    const roomChatID = req.params.roomChatID;

    const find = {
        "deleted": false
    }
    if(roomChatID) find.room_chat_id = roomChatID;

    const user = res.locals.user;

    const roomChatDetail = await RoomChat.findOne({
        "_id": roomChatID
    }).lean();

    const idUser = roomChatDetail.users.filter((item) => item.user_id.toString() != user._id.toString())[0];
    const userReceiveMessage = await User.findOne({"_id": idUser.user_id}).select("_id fullName avatar").lean();

    roomChatDetail.title = userReceiveMessage.fullName;
    roomChatDetail.avatar = userReceiveMessage.avatar;

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
        roomChatDetail: roomChatDetail
    });
}