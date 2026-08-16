var socket = io();

socket.on("SERVER_SEND_DETAIL_ROOM_CHAT", (response) => {
    const myId = document.querySelector("[user_id]").getAttribute("user_id");
    const index = response.sendTo.findIndex((item) => item == myId);
    if (index >= 0) {
        const listCardChat = document.querySelector(".listCardChat");
        console.log(response);
        listCardChat.innerHTML += `
        <div class="cardChat col-3 d-flex items-center gap-x-3">
            <div class="vien">
                <img src=${response.roomChatDetail.avatar ? response.roomChatDetail.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMJ4DJVCvTB59cAmwG1q--V4erVxH9gX21pfDtqX5maHYssQJ_-LCv0r4&s=10"}>
            </div>

            <div class="d-flex flex-column gap-y-1">
                <span class="font-bold font-14">${response.roomChatDetail.title}</span>

                <div class="d-flex items-center gap-x-3">
                    <a href="/chat/${response.roomChatDetail._id}">
                        <button class="bg-blue text-white font-bold border-none">
                            Nhắn tin
                        </button>
                    </a>

                    <button class="border-none px-2">
                        ...
                    </button>
                </div>
            </div>
        </div>`;
    }
})

// Hanlde option
const btnOptions = document.querySelectorAll("[btn-option]");
if (btnOptions.length > 0) {
    btnOptions.forEach((item) => {
        item.addEventListener("click", (e) => {
            const dropDown = item.nextElementSibling;
            if (dropDown) {
                const status = dropDown.getAttribute("status");
                if (status == "close") {
                    dropDown.classList.remove("d-none");
                    dropDown.classList.add("d-flex", "flex-column", "justify-center");
                    dropDown.setAttribute("status", "open");
                } else {
                    dropDown.classList.remove("d-flex", "flex-column", "justify-center");
                    dropDown.classList.add("d-none");
                    dropDown.setAttribute("status", "close");
                }
            }
        })
    })
}

const btnCloses = document.querySelectorAll("[btn-close]");
if (btnCloses.length > 0) {
    btnCloses.forEach((item) => {
        item.addEventListener("click", (e) => {
            const dropDown = item.parentNode;
            if (dropDown) {
                const status = dropDown.getAttribute("status");
                dropDown.classList.remove("d-flex", "flex-column", "justify-center");
                dropDown.classList.add("d-none");
                dropDown.setAttribute("status", "close");
            }
        })
    })
}