const User = require("../models/user.model");

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
        const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName");
        const requestDetail = await User.findOne({ "_id": rqFriendID, "status": "active" }).select("acceptFriends");
        const totalRequest = requestDetail.acceptFriends.length ?? 0;
        const respone = {
            "sendTo": rqFriendID,
            "totalAcceptFriend": totalRequest,
            "userDetail": myDetail
        }
        socket.broadcast.emit("SEVER_RESPONE_AFTER_SEND_REQUEST", respone);
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
        const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName _id");
        const requestDetail = await User.findOne({ "_id": rqFriendID, "status": "active" }).select("acceptFriends");
        const totalRequest = requestDetail.acceptFriends.length ?? 0;
        const respone = {
            "sendTo": rqFriendID,
            "totalAcceptFriend": totalRequest,
            "userID": myDetail._id.toString()
        }
        socket.broadcast.emit("SEVER_RESPONE_AFTER_CANCEL_SEND_REQUEST", respone);


    })
    // END HANDLE CANCEL ADD Friend

    // Handle Accept Request Friend
    socket.on("CLIENT_ACCEPT_REQUEST_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Thêm rqFriendID vào friends của myID và xoá nó trong requestFriends
        const existRQ = await User.findOne({
            "_id": myID,
            "friends": { $in: rqFriendID }
        });
        if (!existRQ) {
            const resultRQ = await User.updateOne({ "_id": myID },
                {
                    $push: { "friends": rqFriendID },
                    $pull: { "acceptFriends": rqFriendID }
                });
        }

        // Thêm myID vào friends của rqFriendID và xoá nó trong requestFriends
        const existACC = await User.findOne({
            "_id": rqFriendID,
            "friends": { $in: myID }
        });
        if (!existACC) {
            const resultACC = await User.updateOne({ "_id": rqFriendID },
                {
                    $push: { "friends": myID },
                    $pull: { "requestFriends": myID }
                });
        }

        // Băn Socket về cho người nhận
        const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName _id");
        const requestDetail = await User.findOne({ "_id": rqFriendID, "status": "active" }).select("acceptFriends");
        const totalRequest = requestDetail.acceptFriends.length ?? 0;
        const respone = {
            "sendTo": rqFriendID,
            "totalAcceptFriend": totalRequest,
            "userDetail": myDetail
        }
        socket.broadcast.emit("SEVER_RESPONE_AFTER_ACCEPT_REQUEST", respone);
    })
    // End Handle Accept Request Friend

    // Handle Reject Requets Friend
    socket.on("CLIENT_REJECT_REQUEST_FRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Xoá rqFriendID trong requestFriend của myID
        const resultACC = await User.updateOne({"_id": myID},{
            $pull: {"acceptFriends": rqFriendID}
        })

        // Xoá myID trong acceptFriends của rqFriendID
        const resultRQ = await User.updateOne({"_id": rqFriendID},{
            $pull: {"requestFriends": myID}
        })

        // Băn Socket về cho người nhận
        const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName _id");
        const requestDetail = await User.findOne({ "_id": rqFriendID, "status": "active" }).select("acceptFriends");
        const totalRequest = requestDetail.acceptFriends.length ?? 0;
        const respone = {
            "sendTo": rqFriendID,
            "totalAcceptFriend": totalRequest,
            "userDetail": myDetail
        }
        socket.broadcast.emit("SEVER_RESPONE_AFTER_REJECT_REQUEST", respone);
    })
    // End Handle Reject Requets Friend

    // Handle Unfriend
    socket.on("CLIENT_SEND_REQUEST_UNFRIEND", async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;

        // Xoá rqFriendID trong friends của myID
        const resultRQ = await User.updateOne({ "_id": myID }, { $pull: { "friends": rqFriendID } });
        // Xoá myID trong friends của rqFriendID
        const resultACC = await User.updateOne({ "_id": rqFriendID }, { $pull: { "friends": myID } });
    })
    // End Handle Unfriend
}