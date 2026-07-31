
var socket = io();
// handleRequestFriend
const btnSendRequestFriends = document.querySelectorAll("button[btn-send-request-friend]");
if (btnSendRequestFriends.length > 0) {
    btnSendRequestFriends.forEach((item) => {
        item.addEventListener("click", (e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if (cardFriend) cardFriend.classList.add("add");
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_ADD_FRIEND", data);
        })
    })
}

// handle cancel send request friend
const btnCancelSendRequestFriend = document.querySelectorAll("button[btn-cancel-request-friend]");
if (btnCancelSendRequestFriend.length > 0) {
    btnCancelSendRequestFriend.forEach((item) => {
        item.addEventListener("click", (e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if (cardFriend) cardFriend.classList.remove("add");
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_CANCEL_ADD_FRIEND", data);
        })
    })
}

// Hanlde accept request friend
const btnAcceptRequestFriend = document.querySelectorAll("button[btn-accept-request-friend]");
if (btnAcceptRequestFriend.length > 0) {
    btnAcceptRequestFriend.forEach((item) => {
        item.addEventListener("click", (e) => {
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_ACCEPT_REQUEST_FRIEND", data);
        })
    })
}

// Handle Unfriend
const btnUnfriends = document.querySelectorAll("button[btn-unfriend]");
if (btnUnfriends.length > 0) {
    btnUnfriends.forEach((item) => {
        item.addEventListener("click", (e) => {
            const myId = document.querySelector("p[user_id]").getAttribute("user_id");
            const rqFriendID = e.target.getAttribute("user-id");
            const data = {
                "myId": myId,
                "id": rqFriendID
            };
            socket.emit("CLIENT_SEND_REQUEST_UNFRIEND", data);
        })
    })
}


//
const idPage = document.querySelector("p[id-page]");
if(idPage && idPage.getAttribute("id-page") == "accept-friend"){
    socket.on("SEVER_RESPONE_AFTER_SEND_REQUEST",(response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if(response.sendTo == myId){
            const listCardFriend = document.querySelector(".listCardFriend");
            listCardFriend.innerHTML+= `<div class="cardFriend col-3 d-flex items-center gap-x-3">
                    <div class="vien">
                        <img src="${response.userDetail.avatar}" alt="">
                    </div>

                    <div class="d-flex flex-column gap-y-1">
                        <span class="font-bold font-14">${response.userDetail.fullName}</span>

                        <button btn-accept-request-friend user-id="${response.userDetail._id}" class="bg-blue text-white font-bold">
                            Chấp nhận
                        </button>

                        <button btn-reject-request-friend user-id="${response.userDetail._id}" class="bg-red text-white font-bold">
                            Từ chối
                        </button>

                        <button btn-cancel-request-friend user-id="${response.userDetail._id}" class="bg-gray text-white font-bold">
                            Huỷ
                        </button>
                    </div>
                </div>`;
            const elementToTalAcceptFriend = document.querySelector(".friend-menu span[totalAcceptFriend]");
            console.log(elementToTalAcceptFriend);
            elementToTalAcceptFriend.innerHTML = `(${response.totalAcceptFriend})`;
        }
    })
}
