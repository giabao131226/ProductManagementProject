const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/roomchat.model");

// [GET] "/chat"
module.exports.index = async (req, res) => {
    try {
        const user = res.locals.user;

        const friendIds = user.friends.map((item) => item.user_id);

        const [roomChat, users] = await Promise.all([
            await RoomChat.find({
                "deleted": false,
                "users.user_id": user._id}).lean(), 
            
            await User.find({
                "_id": {
                    $ne: user._id,
                    $in: friendIds,
                },
                "status": "active",
                "deleted":false
            }).select("_id fullName avatar").lean()
        ]);

        const roomChats = await Promise.all(roomChat.map(async (room) => {
            if (room.typeRoom == "friend") {
                const idUser = room.users.filter((item) => item.user_id.toString() != user._id.toString())[0];
                const userReceiveMessage = await User.findOne({
                    "_id": idUser.user_id
                }).select("_id fullName avatar").lean();

                room.title = userReceiveMessage.fullName;
                room.avatar = userReceiveMessage.avatar;
            }
            return room;
        }));
        
        return res.render("client/pages/chat/chat", {
            "roomChats": roomChats,
            "friends": users
        });
    } catch (ex) {
        console.log("Lỗi ở controller chat(GET /chat): " + ex);
    }
}

// [GET] "/chat/:roomChatID"
module.exports.chat = async (req, res) => {
    const roomChatID = req.params.roomChatID;

    const find = {
        "deleted": false
    }
    if (roomChatID) find.room_chat_id = roomChatID;

    const user = res.locals.user;

    const roomChatDetail = await RoomChat.findOne({
        "_id": roomChatID
    }).lean();

    if (roomChatDetail.typeRoom == "friend") {
        const idUser = roomChatDetail.users.filter((item) => item.user_id.toString() != user._id.toString())[0];
        const userReceiveMessage = await User.findOne({
            "_id": idUser.user_id
        }).select("_id fullName avatar").lean();

        roomChatDetail.title = userReceiveMessage.fullName;
        roomChatDetail.avatar = userReceiveMessage.avatar;
    }

    const chats = await Chat.find(find)
        .sort([
            ["createdAt", "desc"]
        ])
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

// [POST] "/chat/create-room"
module.exports.createRoom = async (req,res) => {
    try{
        const user = res.locals.user;
        if(!req.body.users) req.body.users = [];
        if(typeof(req.body.users) == "string"){
            const users = [req.body.users];
            req.body.users = users;
        }
        req.body.users = req.body.users.map((item) => {
            return {"user_id": item,"role": "Admin"};
        });
        req.body.users.push({
            "user_id": user._id,
            "role": "SuperAdmin"
        });

        const result = await RoomChat.create(req.body);
        return res.redirect("/chat");
    }catch(ex){
        console.log("Lỗi controller createRoom: "+ex);
    }
}