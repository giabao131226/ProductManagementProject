const User = require("../../models/user.model");

// [GET] "/users/not-friends"
module.exports.notFriend = async (req,res) => {
    try{
        const user = res.locals.user;
        _io.on("connection",(socket) => {
            const myID = user._id;
            // HANDLE ADD Friend
            socket.on("CLIENT_ADD_FRIEND",async (data) => {
                const rqFriendID = data.id;

                // Thêm rqFriendID vào danh sách request friend
                const existRQ = await User.findOne({
                    "_id": myID,
                    "requestFriends": {$in: rqFriendID}
                });
                if(!existRQ){
                    const resultRQ = await User.updateOne({"_id": myID},{$push: {
                        "requestFriends": rqFriendID
                    }});
                }
                // Thêm myID vào acceptFriend
                const existACC = await User.findOne({
                    "_id": rqFriendID,
                    "acceptFriends": {$in: myID}
                });
                if(!existACC){
                    const resultACC = await User.updateOne({"_id": rqFriendID},{$push: {
                        "acceptFriends": myID
                    }})
                }
                
            })
            // END HANDLE ADD Friend

            // HANDLE CANCEL ADD Friend
            socket.on("CLIENT_CANCEL_ADD_FRIEND",async (data) => {
                const rqFriendID = data.id;

                // Xoá user-id ở trong bản ghi của người add
                const resultRQ = await User.updateOne(
                    {"_id": myID},
                    {$pull: {"requestFriends": rqFriendID}}
                );
                //

                // Xoá myID ở trong mảng accept id của người được add
                const resultACC = await User.updateOne(
                    {"_id": rqFriendID},
                    {$pull: {"acceptFriends": myID}}
                );
            })
            // END HANDLE CANCEL ADD Friend

        })
        const users = await User.find({
            "status": "active",
            $and: [
                {"_id": {$ne: user._id}},
                {"_id": {$nin: user.friends}},
                {"_id": {$nin: user.requestFriends}},
                {"_id": {$nin: user.acceptFriends}}
            ]
        }).select("_id fullName avatar");
        return res.render("client/pages/friends/not-friend",{
            "users": users,
            "path": "not-friends"
        })
    }catch(ex){
        console.log("Có lỗi xảy ra khi tìm danh sách không phải bạn bè: "+ex);
    }
}

// [GET] "/users"