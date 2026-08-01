function emitFriendEvent(socket, event, target) {
    const myId = document.querySelector("[user_id]").getAttribute("user_id");
    const rqFriendID = target.getAttribute("user-id");

    socket.emit(event, {
        myId,
        id: rqFriendID
    });
}