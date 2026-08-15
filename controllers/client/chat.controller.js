const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/roomchat.model");
const registerChat = require("../../socket/chat.socket");

// [GET] "/chat"
module.exports.index = async (req, res) => {
    try {
        const user = res.locals.user;

        const friendIds = user.friends.map((item) => item.user_id);

        const [roomChat, users] = await Promise.all([
            await RoomChat.find({
                "deleted": false,
                "users.user_id": user._id
            }).lean(),

            await User.find({
                "_id": {
                    $ne: user._id,
                    $in: friendIds,
                },
                "status": "active",
                "deleted": false
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
    const findRoomChat = {"deleted": false};
    const user = res.locals.user;
    const find = {
        "deleted": false,
        "status": "active"
    }
    const fullName = req.query.fullName;

    if (fullName){
        find.fullName = {
            $regex: fullName,
            $options: "i"
        }
    }

    if (roomChatID) findRoomChat.room_chat_id = roomChatID;

    _io.on("connection", (socket) => {
        socket.join(roomChatID);
        registerChat(socket, roomChatID);
    })

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

    const listFriend = user.friends.map((item) => item.user_id);
    const userInRoomChat = roomChatDetail.users.map((item) => item.user_id);
    
    find._id = {
        $ne: user._id,
        $in: listFriend,
        $nin: userInRoomChat
    };

    const [chats, friends] = await Promise.all([
        await Chat.find(findRoomChat)
        .sort([
            ["createdAt", "desc"]
        ])
        .limit(10)
        .populate({
            path: "user_id",
            select: "avatar fullName _id"
        }),
        await User.find(find)
    ]);

    chats.reverse();

    return res.render("client/pages/chat/index.pug", {
        user: user,
        chats: chats,
        roomChatDetail: roomChatDetail,
        friends: friends
    });
}

// [POST] "/chat/create-room"
module.exports.createRoom = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!req.body.users) req.body.users = [];
        if (typeof (req.body.users) == "string") {
            const users = [req.body.users];
            req.body.users = users;
        }
        req.body.users = req.body.users.map((item) => {
            return {
                "user_id": item,
                "role": "Admin"
            };
        });
        req.body.users.push({
            "user_id": user._id,
            "role": "SuperAdmin"
        });

        const result = await RoomChat.create(req.body);
        return res.redirect("/chat");
    } catch (ex) {
        console.log("Lỗi controller createRoom: " + ex);
    }
}

// [PATCH] "/chat/add-user/:roomChatID"
module.exports.addUserToRoom = async (req, res) => {
    try {
        const user = res.locals.user;
        const roomChatID = req.params.roomChatID;

        const roomChatDetail = await RoomChat.findOne({
            "_id": roomChatID
        });
        const myRole = roomChatDetail.users.find((item) => item.user_id.toString() == user._id.toString()).role;

        if(myRole != "SuperAdmin"){
            req.flash("error","Chỉ có quản trị viên hoặc phó phòng mới có quyền thêm thành viên");
            return res.redirect(`/chat/${roomChatID}`);
        }

        if (typeof (req.body.users) == "string") {
            const users = [req.body.users];
            req.body.users = users;
        }
        req.body.users = req.body.users.map((item) => ({
            "user_id": item,
            "role": "Admin"
        }));

        const users = roomChatDetail.users.map((item) => item.user_id);
        const listUsers = req.body.users.filter((item) => users.findIndex((user_id) => user_id == item.user_id) < 0);
        roomChatDetail.users = roomChatDetail.users.concat(listUsers);
        const result = await RoomChat.updateOne({
            "_id": roomChatID
        }, {
            "users": roomChatDetail.users
        });
        _io.on("connection",(socket) => {
            socket.broadcast.emit("SERVER_SEND_DETAIL_ROOM_CHAT",{
                "sendTo": listUsers.map((item) => item.user_id),
                "roomChatDetail": {
                    "_id": roomChatID,
                    "avatar": roomChatDetail.avatar,
                    "title": roomChatDetail.title
                }
            });
        })
        return res.redirect(`/chat/${roomChatID}`);
    } catch (ex) {
        console.log("Lỗi controller addUserToRoom: " + ex);
    }
}