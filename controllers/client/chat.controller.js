const Chat = require("../../models/chat.model");
const uploadImage = require("../../helper/uploadImage");

// [GET] "/chat"
module.exports.chat = async (req, res) => {
    const user = res.locals.user;
    _io.once("connection", (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (msg) => {
            let images = [];
            if (msg.images.length > 0) {
                images = await Promise.all(
                    msg.images.map(async (file) => {
                        const result = await uploadImage.uploadBuffer(file);
                        return result.secure_url;
                    })
                );
            }
            const result = await Chat.create({
                content: msg.content,
                user_id: user._id,
                images: images
            });
            const respone = {
                "user_id": user._id,
                "content": msg.content,
                "userName": user.fullName,
                "avatar": user.avatar,
                "images": images
            }
            _io.emit("SERVER_RETURN_MESSAGE", respone);
        })

        socket.on("CLIENT_TYPE_MESSAGE", (att) => {
            socket.broadcast.emit("SERVER_SEND_ATT_TYPE_MESSAGE", att);
        })

    })
    const chats = await Chat.find({}).sort([
        ["createdAt", "desc"]
    ]).limit(10).populate({
        path: "user_id",
        select: "avatar fullName"
    });
    chats.reverse();
    console.log(chats);
    return res.render("client/pages/chat/index.pug", {
        user: user,
        chats: chats
    });
}