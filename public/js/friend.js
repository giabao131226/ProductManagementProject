
var socket = io();
// handleRequestFriend
const btnSendRequestFriends = document.querySelectorAll("button[btn-send-request-friend]");
if(btnSendRequestFriends.length>0){
    btnSendRequestFriends.forEach((item) => {
        item.addEventListener("click",(e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if(cardFriend) cardFriend.classList.add("add");
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
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
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_CANCEL_ADD_FRIEND",data);
        })
    })
}

// Hanlde accept request friend
const btnAcceptRequestFriend = document.querySelectorAll("button[btn-accept-request-friend]");
if(btnAcceptRequestFriend.length>0){
    btnAcceptRequestFriend.forEach((item) => {
        item.addEventListener("click",(e) => {
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_ACCEPT_REQUEST_FRIEND",data);
        })
    })
}

// Handle Unfriend
const btnUnfriends = document.querySelectorAll("button[btn-unfriend]");
if(btnUnfriends.length>0){
    btnUnfriends.forEach((item) => {
        item.addEventListener("click",(e) => {
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_SEND_REQUEST_UNFRIEND",data);
        })
    })
}