const User = require("../models/user.model");
const severResponseFriend = require("../helper/serverResponseFriend");
const RoomChat = require("../models/roomchat.model");

module.exports = (socket) => {
    // HANDLE ADD Friend
    socket.on("CLIENT_ADD_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Thêm rqFriendID vào danh sách request friend
        const existRQ = await User.findOne({
            "_id": myID,
            "requestFriends": { $in: rqFriendID }
        });
        if (!existRQ) {
            const resultRQ = await User.updateOne({ "_id": myID }, {
                $push: {
                    "requestFriends": rqFriendID
                }
            });
        }
        // Thêm myID vào acceptFriend
        const existACC = await User.findOne({
            "_id": rqFriendID,
            "acceptFriends": { $in: myID }
        });
        if (!existACC) {
            const resultACC = await User.updateOne({ "_id": rqFriendID }, {
                $push: {
                    "acceptFriends": myID
                }
            })
        }

        // Băn Socket về cho người nhận
        severResponseFriend(socket, "SEVER_RESPONE_AFTER_SEND_REQUEST", myID, rqFriendID);
    })
    // END HANDLE ADD Friend

    // HANDLE CANCEL ADD Friend
    socket.on("CLIENT_CANCEL_ADD_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Xoá user-id ở trong bản ghi của người add
        const resultRQ = await User.updateOne(
            { "_id": myID },
            { $pull: { "requestFriends": rqFriendID } }
        );
        //

        // Xoá myID ở trong mảng accept id của người được add
        const resultACC = await User.updateOne(
            { "_id": rqFriendID },
            { $pull: { "acceptFriends": myID } }
        );

        // Băn Socket về cho người nhận
        severResponseFriend(socket, "SEVER_RESPONE_AFTER_CANCEL_SEND_REQUEST", myID, rqFriendID);
    })
    // END HANDLE CANCEL ADD Friend

    // Handle Accept Request Friend
    socket.on("CLIENT_ACCEPT_REQUEST_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        const [existRQ, existACC] = await Promise.all([
            User.findOne({
                "_id": myID,
                "friends.user_id": rqFriendID
            }),
            User.findOne({
                "_id": rqFriendID,
                "friends.user_id": myID
            })
        ]);

        if (!existRQ && !existACC) {
            const roomChat = await RoomChat.create({
                "typeRoom": "friend",
                "status": "active",
                "users": [
                    {
                        "user_id": myID,
                        "role": "SuperAdmin"
                    },
                    {
                        "user_id": rqFriendID,
                        "role": "SuperAdmin"
                    },
                ]
            });

            const [resultRQ, resultACC] = await Promise.all([
                User.updateOne({ "_id": myID },
                    {
                        $push: {
                            "friends": {
                                "user_id": rqFriendID,
                                "room_chat_id": roomChat._id
                            }
                        },
                        $pull: { "acceptFriends": rqFriendID }
                    }),
                User.updateOne({ "_id": rqFriendID },
                    {
                        $push: {
                            "friends": {
                                "user_id": myID,
                                "room_chat_id": roomChat._id
                            }
                        },
                        $pull: { "requestFriends": myID }
                    })
            ]);
            // Băn Socket về cho người nhận
            severResponseFriend(socket, "SEVER_RESPONE_AFTER_ACCEPT_REQUEST", myID, rqFriendID);
        }
    })
    // End Handle Accept Request Friend

    // Handle Reject Requets Friend
    socket.on("CLIENT_REJECT_REQUEST_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Xoá rqFriendID trong requestFriend của myID
        const resultACC = await User.updateOne({ "_id": myID }, {
            $pull: { "acceptFriends": rqFriendID }
        })

        // Xoá myID trong acceptFriends của rqFriendID
        const resultRQ = await User.updateOne({ "_id": rqFriendID }, {
            $pull: { "requestFriends": myID }
        })

        // Băn Socket về cho người nhận
        severResponseFriend(socket, "SEVER_RESPONE_AFTER_REJECT_REQUEST", myID, rqFriendID);
    })
    // End Handle Reject Requets Friend

    // Handle Unfriend
    socket.on("CLIENT_SEND_REQUEST_UNFRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Xoá rqFriendID trong friends của myID
        const resultRQ = await User.updateOne({ "_id": myID }, { $pull: { "friends": { "user_id": rqFriendID } } });
        // Xoá myID trong friends của rqFriendID
        const resultACC = await User.updateOne({ "_id": rqFriendID }, { $pull: { "friends": { "user_id": myID } } });

        // Băn Socket về cho người nhận
        const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName _id");
        const respone = {
            "sendTo": rqFriendID,
            "userDetail": myDetail
        }
        socket.broadcast.emit("SEVER_RESPONE_AFTER_UNFRIEND", respone);
    })
    // End Handle Unfriend
}