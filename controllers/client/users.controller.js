const User = require("../../models/user.model");

// [GET] "/users/not-friends"
module.exports.notFriend = async (req, res) => {
    try {
        const user = res.locals.user;
        const friendID = user.friends.map((item) => item.user_id);

        const users = await User.find({
            "status": "active",
            $and: [
                { "_id": { $ne: user._id } },
                { "_id": { $nin: friendID } },
                { "_id": { $nin: user.requestFriends } },
                { "_id": { $nin: user.acceptFriends } }
            ]
        }).select("_id fullName avatar");
        
        return res.render("client/pages/friends/not-friend", {
            "totalAcceptFriend": user.acceptFriends?.length ?? 0,
            "users": users,
            "path": "not-friends"
        })
    } catch (ex) {
        console.log("Có lỗi xảy ra khi tìm danh sách không phải bạn bè: " + ex);
    }
}

// [GET] "/users/request-friends"
module.exports.requestFriends = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User.find({
            "status": "active",
            $and: [
                { "_id": { $ne: user._id } },
                { "_id": { $in: user.requestFriends } }
            ]
        }).select("_id fullName avatar");
        return res.render("client/pages/friends/request-friend", {
            users: users,
            "totalAcceptFriend": user.acceptFriends?.length ?? 0,
            "path": "request-friends"
        });
    } catch (ex) {
        console.log("Có lỗi xảy ra khi hiển thị trang lời mời đã gửi: " + ex);
    }
}

// [GET] "/users/requests"
module.exports.acceptFriends = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User.find({
            "status": "active",
            $and: [
                { "_id": { $ne: user._id } },
                { "_id": { $in: user.acceptFriends } }
            ]
        }).select("_id fullName avatar");
        return res.render("client/pages/friends/accept-friend", {
            "users": users,
            "totalAcceptFriend": user.acceptFriends?.length ?? 0,
            "path": "requests"
        })
    } catch (ex) {
        console.log("Có lỗi xảy ra khi hiển thị trang lời mời đã nhận: " + ex);
    }
}

// [GET] "/users/friends"
module.exports.friends = async (req, res) => {
    try {
        const user = res.locals.user;
        const friendIDs = user.friends.map((item) => item.user_id);

        const users = await User.find({
            "status": "active",
            "_id": { $in: friendIDs }
        }).select("_id fullName avatar online").lean();

        const listUser = users.map((item) => {
            const index = user.friends.findIndex((friend) => friend.user_id == item._id);
            return {...item,"room_chat_id": user.friends[index].room_chat_id};
        })

        return res.render("client/pages/friends/list-friend", {
            "users": listUser,
            "totalAcceptFriend": user.acceptFriends?.length ?? 0,
            "path": "friends"
        })
    } catch (ex) {
        console.log("Có lỗi xảy ra khi hiển thị danh sách bạn bè: " + ex);
    }
}