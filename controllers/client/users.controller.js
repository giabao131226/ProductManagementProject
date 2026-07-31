const User = require("../../models/user.model");

// [GET] "/users/not-friends"
module.exports.notFriend = async (req,res) => {
    try{
        const user = res.locals.user;
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

// [GET] "/users/request-friends"
module.exports.requestFriends = async (req,res) => {
    try{
        const user = res.locals.user;
        const users = await User.find({
            "status": "active",
            $and: [
                {"_id": {$ne: user._id}},
                {"_id": {$in: user.requestFriends}}
            ]
        }).select("_id fullName avatar");
        return res.render("client/pages/friends/request-friend",{
            users: users
        });
    }catch(ex){
        console.log("Có lỗi xảy ra khi hiển thị trang lời mời đã gửi: "+ex);
    }
}

// [GET] "/users/requests"
module.exports.acceptFriends = async (req,res) => {
    try{
        const user = res.locals.user;
        const users = await User.find({
            "status": "active",
            $and: [
                {"_id": {$ne: user._id}},
                {"_id": {$in: user.acceptFriends}}
            ]
        }).select("_id fullName avatar");
        return res.render("client/pages/friends/accept-friend",{
            "users": users
        })
    }catch(ex){
        console.log("Có lỗi xảy ra khi hiển thị trang lời mời đã nhận: "+ex);
    }
}