
var socket = io();
// handleRequestFriend
const btnSendRequestFriends = document.querySelectorAll("button[btn-send-request-friend]");
if(btnSendRequestFriends.length>0){
    btnSendRequestFriends.forEach((item) => {
        item.addEventListener("click",(e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if(cardFriend) cardFriend.classList.add("add");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "id": rqFriendID
            };
            console.log(data);
            socket.emit("CLIENT_ADD_FRIEND",data);
        })
    })
}

// handle cancel send request friend
const btnCancelSendRequestFriend = document.querySelectorAll("button[btn-cancel-request-friend]");
if(btnCancelSendRequestFriend.length>0){
    btnCancelSendRequestFriend.forEach((item) => {
        item.addEventListener("click",(e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if(cardFriend) cardFriend.classList.remove("add");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "id": rqFriendID
            };
            socket.emit("CLIENT_CANCEL_ADD_FRIEND",data);
        })
    })
}