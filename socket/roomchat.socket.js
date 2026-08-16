
module.exports = (sendTo, roomChatDetail) =>{
    return _io.emit("SERVER_SEND_DETAIL_ROOM_CHAT", {
        "sendTo": sendTo,
        "roomChatDetail": roomChatDetail
    })
}