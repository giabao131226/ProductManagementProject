const Chat = require("../../models/chat.model");

// [GET] "/chat"
module.exports.chat = async (req,res) => {
    const user = res.locals.user;
    _io.once("connection",(socket) => {
        socket.on("CLIENT_SEND_MESSAGE",async (msg) => {
            const result = await Chat.create({
                content: msg,
                user_id: user._id
            });
            const respone = {
                "user_id": user._id,
                "content": msg,
                "userName": user.fullName,
                "avatar": user.avatar
            }
            _io.emit("SERVER_RETURN_MESSAGE",respone);
        })

        socket.on("CLIENT_TYPE_MESSAGE",(att) => {
            socket.broadcast.emit("SERVER_SEND_ATT_TYPE_MESSAGE",att);
        })

    })
    const chats = await Chat.find({}).sort([["createdAt", "desc"]]).limit(10).populate({path: "user_id",select: "avatar fullName"});
    chats.reverse();
    return res.render("client/pages/chat/index.pug",
        {
            user: user,
            chats: chats
        }
    );
}