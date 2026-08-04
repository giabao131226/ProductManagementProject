const uploadImage = require("../helper/uploadImage");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

module.exports = (socket) => {
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
            user_id: msg.myID,
            images: images
        });

        const userDetail = await User.findOne({"_id": msg.myID,"status": "active"})
            .select("_id fullName avatar");
        const respone = {
            "userDetail": {
                "_id": userDetail._id,
                "fullName": userDetail.fullName,
                "avatar": userDetail.avatar,
            },
            "content": msg.content,
            "images": images
        }
        socket.broadcast.emit("SERVER_RETURN_MESSAGE", respone);
    })

    socket.on("CLIENT_TYPE_MESSAGE", (att) => {
        socket.broadcast.emit("SERVER_SEND_ATT_TYPE_MESSAGE", att);
    })
}