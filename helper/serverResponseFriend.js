const User = require("../models/user.model");

module.exports = async (socket,event, myID, rqFriendID) => {
    console.log(rqFriendID);
    const myDetail = await User.findOne({ "_id": myID, "status": "active" }).select("avatar fullName _id");
    const requestDetail = await User.findOne({ "_id": rqFriendID, "status": "active" }).select("acceptFriends");
    const totalRequest = requestDetail.acceptFriends.length ?? 0;
    const respone = {
        "sendTo": rqFriendID,
        "totalAcceptFriend": totalRequest,
        "userDetail": myDetail
    }
    socket.broadcast.emit(event, respone);
}