function emitFriendEvent(socket, event, target) {
    const myId = document.querySelector("[user_id]").getAttribute("user_id");
    const rqFriendID = target.getAttribute("user-id");

    socket.emit(event, {
        myId,
        id: rqFriendID
    });
}


module.exports.sendStatusOnline = async (user) => {
    _io.emit("SEVER_SEND_DETAIL_CLIENT_ONLINE", {
        "sendTo": user.friends,
        "userID": user._id,
        "online": !user.online
    });
}