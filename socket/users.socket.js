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
    })
    // END HANDLE CANCEL ADD Friend

    // Handle Accept Request Friend
    socket.on("CLIENT_ACCEPT_REQUEST_FRIEND",async (data) => {
        const myID = data.myId;
        const rqFriendID = data.id;
        console.log(data);

        // Thêm rqFriendID vào friends của myID và xoá nó trong requestFriends
        const existRQ = await User.findOne({
            "_id": myID,
            "friends": {$in: rqFriendID}
        });
        if(!existRQ){
            const resultRQ = await User.updateOne({"_id": myID},
                {$push: {"friends": rqFriendID},
                $pull: {"requestFriends": rqFriendID}
            });
        }

        // Thêm myID vào friends của rqFriendID và xoá nó trong requestFriends
        const existACC = await User.findOne({
            "_id": rqFriendID,
            "friends": {$in: myID}
        });
        if(!existACC){
            const resultACC = await User.updateOne({"_id": rqFriendID},
                {$push: {"friends": myID},
                $pull: {"requestFriends": myID}
            });
        }
    })
    // End Handle Accept Request Friend
}