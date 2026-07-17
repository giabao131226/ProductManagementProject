const Chat = require("../../models/chat.model");

// [GET] "/chat"
module.exports.chat = async (req,res) => {
    const user = res.locals.user;
    _io.on("connection",(socket) => {
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
            console.log(respone)
            _io.emit("SERVER_RETURN_MESSAGE",respone);
        })

    })
    return res.render("client/pages/chat/index.pug",
        {
            user: user
        }
    );
}