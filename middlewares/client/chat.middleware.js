const RoomChat = require("../../models/roomchat.model");

module.exports.check = async (req,res,next) => {
    try{    
        const user = res.locals.user;
        const roomChatID = req.params.roomChatID;

        const roomChat = await RoomChat.findOne({
            "_id": roomChatID,
            "users.user_id": user._id
        });

        if(!roomChat){
            return res.send("404 not found");
        }
        return next();

    }catch(ex){
        console.log("Lỗi tại middleware chat: "+ex);
        return res.send("404 NOT FOUND");
    }
}