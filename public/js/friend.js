function emitFriendEvent(socket, event, target) {
    const myId = document.querySelector("[user_id]").getAttribute("user_id");
    const rqFriendID = target.getAttribute("user-id");
    socket.emit(event, {
        myId,
        id: rqFriendID
    });
}

function updateNewToTalRequestFriend(totalAcceptFriend) {
    const elementToTalAcceptFriend = document.querySelector(".friend-menu span[totalAcceptFriend]");
    elementToTalAcceptFriend.innerHTML = `${totalAcceptFriend}`;
}
// Hàm xử lý sự kiện Chấp Nhận Kết Bạn
function handleAcceptFriend(e, socket) {
    const cardFriend = document.querySelector(".cardFriend[user-id]");
    cardFriend.remove();
    const elementToTalAcceptFriend = document.querySelector(".friend-menu span[totalAcceptFriend]");
    elementToTalAcceptFriend.innerHTML = (parseInt(elementToTalAcceptFriend.innerHTML) - 1);
    emitFriendEvent(socket, "CLIENT_ACCEPT_REQUEST_FRIEND", e.target);
}

// Hàm xử lý sự kiện Từ Chối Kết Bạn
function handleRejectFriend(e, socket) {
    const userID = e.target.getAttribute("user-id");
    const cardFriend = e.target.parentNode.closest(".cardFriend");
    const listCard = cardFriend.closest(".listCardFriend");
    listCard.removeChild(cardFriend);
    emitFriendEvent(socket, "CLIENT_REJECT_REQUEST_FRIEND", e.target);
}

// Hàm xử lý sự kiện gửi lời mời kết bạn
function handleSendRequestFriend(e, socket) {
    const cardFriend = e.target.parentNode.closest(".cardFriend");
    if (cardFriend) cardFriend.classList.add("add");
    emitFriendEvent(socket, "CLIENT_ADD_FRIEND", e.target);
}

// Hàm xử lý sự kiện huỷ gửi lời mời kết bạn
function handleCancelSendRequestFriend(e, socket) {
    const cardFriend = e.target.parentNode.closest(".cardFriend");
    if (cardFriend) cardFriend.classList.remove("add");
    emitFriendEvent(socket, "CLIENT_CANCEL_ADD_FRIEND", e.target);
}

var socket = io();
const idPage = document.querySelector("p[id-page]");

// handleRequestFriend
const btnSendRequestFriends = document.querySelectorAll("button[btn-send-request-friend]");
if (btnSendRequestFriends.length > 0) {
    btnSendRequestFriends.forEach((item) => {
        item.addEventListener("click", (e) => { handleSendRequestFriend(e, socket) });
    })
}

// handle cancel send request friend
const btnCancelSendRequestFriend = document.querySelectorAll("button[btn-cancel-request-friend]");
if (btnCancelSendRequestFriend.length > 0) {
    btnCancelSendRequestFriend.forEach((item) => {
        item.addEventListener("click", (e) => {
            handleCancelSendRequestFriend(e, socket);
        })
    })
}

// Hanlde accept request friend
const btnAcceptRequestFriend = document.querySelectorAll("button[btn-accept-request-friend]");
if (btnAcceptRequestFriend.length > 0) {
    btnAcceptRequestFriend.forEach((item) => {
        item.addEventListener("click", (e) => { handleAcceptFriend(e, socket) });
    })
}

// Handle reject request friend
const btnRejectRequestFriend = document.querySelectorAll("button[btn-reject-request-friend]");
if (btnRejectRequestFriend.length > 0) {
    btnRejectRequestFriend.forEach((item) => {
        item.addEventListener("click", (e) => { handleRejectFriend(e, socket) });
    })
}

// Handle Unfriend
const btnUnfriends = document.querySelectorAll("button[btn-unfriend]");
if (btnUnfriends.length > 0) {
    btnUnfriends.forEach((item) => {
        item.addEventListener("click", (e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if (cardFriend) cardFriend.classList.remove("add");
            emitFriendEvent(socket, "CLIENT_SEND_REQUEST_UNFRIEND", e.target);
        })
    })
}
//

if (idPage) {
    const pageNow = idPage.getAttribute("id-page");
    // Handle SEVER_RESPONE_AFTER_SEND_REQUEST
    socket.on("SEVER_RESPONE_AFTER_SEND_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if (response.sendTo == myId) {
            updateNewToTalRequestFriend(response.totalAcceptFriend);
            const listCardFriend = document.querySelector(".listCardFriend");
            if (pageNow == "accept-friend") {
                listCardFriend.innerHTML += `<div class="cardFriend col-3 d-flex items-center gap-x-3" user-id = ${response.userDetail._id}>
                    <div class="vien">
                        <img src="${response.userDetail.avatar}" alt="">
                    </div>

                    <div class="d-flex flex-column gap-y-1">
                        <span class="font-bold font-14">${response.userDetail.fullName}</span>

                        <button btn-accept-request-friend onclick = "handleAcceptFriend(event,socket)" user-id="${response.userDetail._id}" class="bg-blue text-white font-bold">
                            Chấp nhận
                        </button>

                        <button btn-reject-request-friend onclick = "handleRejectFriend(event,socket)" user-id="${response.userDetail._id}" class="bg-red text-white font-bold">
                            Từ chối
                        </button>

                        <button btn-cancel-request-friend user-id="${response.userDetail._id}" class="bg-gray text-white font-bold">
                            Huỷ
                        </button>
                    </div>
                </div>`;
            } else if (pageNow == "not-friend") {
                const cardFriend = document.querySelector(`.cardFriend[user-id = '${response.userDetail._id}']`);
                if (cardFriend) cardFriend.remove();
            }

        }
    })
    // End Handle SEVER_RESPONE_AFTER_SEND_REQUEST

    // Handle SEVER RESPONE AFTER CANCEL SEND REQUEST
    socket.on("SEVER_RESPONE_AFTER_CANCEL_SEND_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if (response.sendTo == myId) {
            updateNewToTalRequestFriend(response.totalAcceptFriend);
            const listCardFriend = document.querySelector(".listCardFriend");
            if (pageNow == "accept-friend") {
                const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userDetail._id}"]`);
                cardFriend.remove();
            } else if (pageNow == "not-friend") {
                listCardFriend.innerHTML += `<div class="cardFriend col-3 d-flex items-center gap-x-3" user-id="${response.userDetail._id}">
                    <div class="vien">
                        <img src="${response.userDetail.avatar}" alt="${response.userDetail.fullName}">
                    </div>
                    <div class="d-flex flex-column gap-y-1">
                        <span class="font-bold font-14">${response.userDetail.fullName}</span>
                        <button
                            onclick = "handleSendRequestFriend(event,socket)"
                            btn-send-request-friend
                            user-id="${response.userDetail._id}"
                            class="bg-blue text-white font-bold">
                            Kết Bạn
                        </button>
                        <button
                            onclick = "handleCancelSendRequestFriend(event,socket)"
                            btn-unfriend
                            user-id="${response.userDetail._id}"
                            class="bg-blue text-white font-bold border-none">
                            Huỷ Kết Bạn
                        </button>
                    </div>
                </div>`;
            }
        }
    })
    // End Handle SEVER RESPONE AFTER CANCEL SEND REQUEST

    // Handle SEVER RESPONE AFTER ACCEPT REQUEST
    socket.on("SEVER_RESPONE_AFTER_ACCEPT_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        const listCardFriend = document.querySelector(".listCardFriend");
        if (response.sendTo == myId && (pageNow == "not-friend" || pageNow == "request-friend")) {
            const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userDetail._id}"]`);
            if (cardFriend) cardFriend.remove();
        }
    })
    // Handle SEVER RESPONE AFTER ACCEPT REQUEST

    // Handle SEVER RESPONE AFTER REJECT REQUEST
    socket.on("SEVER_RESPONE_AFTER_REJECT_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        const listCardFriend = document.querySelector(".listCardFriend");
        if (response.sendTo == myId && (pageNow == "not-friend" || pageNow == "request-friend")) {
            const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userDetail._id}"]`);
            if (cardFriend) cardFriend.classList.remove("add");
        }
    })
    // Handle SEVER RESPONE AFTER REJECT REQUEST

    // Handle SEVER_RESPONE_AFTER_UNFRIEND
    socket.on("SEVER_RESPONE_AFTER_UNFRIEND", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        const listCardFriend = document.querySelector(".listCardFriend");
        if (response.sendTo == myId && pageNow == "list-friend") {
            const cardFriend = document.querySelector(`.cardFriend[user-id = '${response.userDetail._id}']`);
            if (cardFriend) cardFriend.remove();
        } else if (response.sendTo == myId && pageNow == "not-friend") {
            listCardFriend.innerHTML += `<div class="cardFriend col-3 d-flex items-center gap-x-3" user-id="${response.userDetail._id}">
                    <div class="vien">
                        <img src="${response.userDetail.avatar}" alt="${response.userDetail.fullName}">
                    </div>
                    <div class="d-flex flex-column gap-y-1">
                        <span class="font-bold font-14">${response.userDetail.fullName}</span>
                        <button
                            onclick = {(e) => handleSendRequestFriend(e,socket)}
                            btn-send-request-friend
                            user-id="${response.userDetail._id}"
                            class="bg-blue text-white font-bold">
                            Kết Bạn
                        </button>
                        <button
                            onclick = {(e) => handleCancelSendRequestFriend(e,socket)}
                            btn-unfriend
                            user-id="${response.userDetail._id}"
                            class="bg-blue text-white font-bold border-none">
                            Huỷ Kết Bạn
                        </button>
                    </div>
                </div>`;
        }
    })
    // End Handle SEVER_RESPONE_AFTER_UNFRIEND
}

// Handle SEVER_SEND_DETAIL_CLIENT_ONLINE
socket.on("SEVER_SEND_DETAIL_CLIENT_ONLINE",(response) => {
    const myId = document.querySelector("p[user_id]").getAttribute("user_id");
    const index = response.sendTo.findIndex((item) => item == myId);
    if(index >= 0){
        const cardFriend = document.querySelector(`.cardFriend[user-id="${response.userID}"]`);
        const online = cardFriend.querySelector(".online");
        online.classList.remove("bg-offline");
        online.classList.remove("bg-online");
        online.classList.add(response.online ? "bg-online" : "bg-offline");
    }
})
//
