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

function handleAcceptFriend(e) {
    const cardFriend = document.querySelector(".cardFriend[user-id]");
    cardFriend.remove();
    const elementToTalAcceptFriend = document.querySelector(".friend-menu span[totalAcceptFriend]");
    elementToTalAcceptFriend.innerHTML = (parseInt(elementToTalAcceptFriend.innerHTML) - 1);
    emitFriendEvent(socket, "CLIENT_ACCEPT_REQUEST_FRIEND", e.target);
}

function handleRejectFriend(e) {
    const userID = e.target.getAttribute("user-id");
    const cardFriend = e.target.parentNode.closest(".cardFriend");
    const listCard = cardFriend.closest(".listCardFriend");
    listCard.removeChild(cardFriend);
    emitFriendEvent(socket, "CLIENT_REJECT_REQUEST_FRIEND", e.target);
}

var socket = io();
// handleRequestFriend
const btnSendRequestFriends = document.querySelectorAll("button[btn-send-request-friend]");
if (btnSendRequestFriends.length > 0) {
    btnSendRequestFriends.forEach((item) => {
        item.addEventListener("click", (e) => {
            const cardFriend = e.target.parentNode.closest(".cardFriend");
            if (cardFriend) cardFriend.classList.add("add");
            emitFriendEvent(socket, "CLIENT_ADD_FRIEND", e.target);
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
            emitFriendEvent(socket, "CLIENT_CANCEL_ADD_FRIEND", e.target);
        })
    })
}

// Hanlde accept request friend
const btnAcceptRequestFriend = document.querySelectorAll("button[btn-accept-request-friend]");
if (btnAcceptRequestFriend.length > 0) {
    btnAcceptRequestFriend.forEach((item) => {
        item.addEventListener("click", handleAcceptFriend);
    })
}

// Handle reject request friend
const btnRejectRequestFriend = document.querySelectorAll("button[btn-reject-request-friend]");
if (btnRejectRequestFriend.length > 0) {
    btnRejectRequestFriend.forEach((item) => {
        item.addEventListener("click", handleRejectFriend);
    })
}

// Handle Unfriend
const btnUnfriends = document.querySelectorAll("button[btn-unfriend]");
if (btnUnfriends.length > 0) {
    btnUnfriends.forEach((item) => {
        item.addEventListener("click", (e) => {
            const parent = e.target.parentNode;
            if(parent){
                parent.classList.remove("friend");
                parent.classList.add("unfriend");
            }
            emitFriendEvent(socket, "CLIENT_SEND_REQUEST_UNFRIEND", e.target);
        })
    })
}
//

const idPage = document.querySelector("p[id-page]");
if (idPage) {
    // Handle 
    socket.on("SEVER_RESPONE_AFTER_SEND_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if (response.sendTo == myId) {
            updateNewToTalRequestFriend(response.totalAcceptFriend);
            const listCardFriend = document.querySelector(".listCardFriend");

            if (idPage.getAttribute("id-page") == "accept-friend") {
                listCardFriend.innerHTML += `<div class="cardFriend col-3 d-flex items-center gap-x-3" user-id = ${response.userDetail._id}>
                    <div class="vien">
                        <img src="${response.userDetail.avatar}" alt="">
                    </div>

                    <div class="d-flex flex-column gap-y-1">
                        <span class="font-bold font-14">${response.userDetail.fullName}</span>

                        <button btn-accept-request-friend onclick = "handleAcceptFriend(event)" user-id="${response.userDetail._id}" class="bg-blue text-white font-bold">
                            Chấp nhận
                        </button>

                        <button btn-reject-request-friend onclick = "handleRejectFriend(event)" user-id="${response.userDetail._id}" class="bg-red text-white font-bold">
                            Từ chối
                        </button>

                        <button btn-cancel-request-friend user-id="${response.userDetail._id}" class="bg-gray text-white font-bold">
                            Huỷ
                        </button>
                    </div>
                </div>`;
            }

        }
    })
    //

    // Handle SEVER RESPONE AFTER CANCEL SEND REQUEST
    socket.on("SEVER_RESPONE_AFTER_CANCEL_SEND_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if (response.sendTo == myId) {
            updateNewToTalRequestFriend(response.totalAcceptFriend);
            const listCardFriend = document.querySelector(".listCardFriend");

            if (idPage.getAttribute("id-page") == "accept-friend") {
                const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userID}"]`);
                cardFriend.remove();
            }
        }
    })
    // End Handle SEVER RESPONE AFTER CANCEL SEND REQUEST

    // Handle SEVER RESPONE AFTER ACCEPT REQUEST
    socket.on("SEVER_RESPONE_AFTER_ACCEPT_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        const listCardFriend = document.querySelector(".listCardFriend");
        if (response.sendTo == myId && idPage.getAttribute("id-page") == "not-friend") {
            const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userDetail._id}"]`);
            cardFriend.remove();
        }
    })
    // Handle SEVER RESPONE AFTER ACCEPT REQUEST

    // Handle SEVER RESPONE AFTER REJECT REQUEST
    socket.on("SEVER_RESPONE_AFTER_REJECT_REQUEST", (response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        const listCardFriend = document.querySelector(".listCardFriend");
        if (response.sendTo == myId && idPage.getAttribute("id-page") == "not-friend") {
            const cardFriend = listCardFriend.querySelector(`.cardFriend[user-id = "${response.userDetail._id}"]`);
            if (cardFriend) cardFriend.classList.remove("add");
        }
    })
    // Handle SEVER RESPONE AFTER REJECT REQUEST

    // Handle SEVER_RESPONE_AFTER_UNFRIEND
    socket.on("SEVER_RESPONE_AFTER_UNFRIEND",(response) => {
        const myId = document.querySelector("p[user_id]").getAttribute("user_id");
        if(response.sendTo == myId && idPage.getAttribute("id-page") == "list-friend"){
            const cardFriend = document.querySelector(`.cardFriend[user-id = '${response.userDetail._id}']`);
            const child2 = cardFriend.children[1];
            child2.classList.remove("friend");
            child2.classList.add("unfriend");
        }
    })
    // End Handle SEVER_RESPONE_AFTER_UNFRIEND

}
