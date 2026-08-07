
var socket = io();
const bodyChat = document.querySelector(".chat-body");
const typing = bodyChat?.querySelector(".chat-typing");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Handle Send Message
const formSendMessage = document.querySelector("[form-send-message]");
if (formSendMessage) {
    formSendMessage.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = e.target.querySelector("input#message");
        const inputImage = e.target.querySelector("input[name='images']");
        if (input.value.trim() == "" && inputImage.files.length == 0) return;
        const myID = document.querySelector("p[user_id]").getAttribute("user_id");
        const msg = {
            "content": input.value,
            "images": [...inputImage.files],
            "myID": myID
        };
        // Handle Add tin nhắn vừa gửi
        typing.insertAdjacentHTML("beforebegin",`<div class="message">
            <div class="right">
                <div class="message-main">
                    <div class="message-top">
                        <div class="d-flex flex-column items-start">
                            <div class="bubble">${input.value}</div>
                        </div>
                    </div>
                    <div class = "message-bottom">
                    ${inputImage.files.length > 0 ?
                Array.from(inputImage.files).map((item) => `<div class="image">
                            <img src = "${URL.createObjectURL(item)}"></img>
                        </div>`)
                : ""}
                    </div>
                </div>
            </div>
        </div>`)
        // 
        input.value = "";
        const messageImages = document.querySelector(".message-images");
        messageImages.innerHTML = "";
        socket.emit("CLIENT_SEND_MESSAGE", msg);
        bodyChat.scrollTop = bodyChat.scrollHeight;
    })
}

socket.on("SERVER_RETURN_MESSAGE", (respone) => {
    typing.insertAdjacentHTML( "beforebegin",`<div class="message">
    <div class="left">
        <div class="message-main">
            <div class="message-top">
                <div class="avatar">
                    <img src = ${respone.userDetail.avatar ? respone.userDetail.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3VktJ0YLo0ZxJKPkqj78Wsw2WB86Piq0M8x9y7g1gpQ&s=10"}>
                </div>

                <div class="d-flex flex-column items-start">
                    <span class="font-bold">${respone.userDetail.fullName}</span>
                    <div class="bubble">${respone.content}</div>
                </div>
            </div>

            <div class="message-bottom">
                ${respone.images.length > 0 ?
                    respone.images.map((item) => `<div class="image">
                            <img src = "${item}"></img>
                        </div>`)
            : ""}
            </div>
        </div>
    </div>
</div>`)
    bodyChat.scrollTop = bodyChat.scrollHeight;
})

// Handle Typing
const inputMessage = document.querySelector("input#message");
if (inputMessage) {
    inputMessage.addEventListener("input", () => {
        socket.emit("CLIENT_TYPE_MESSAGE", "show");
    })
}
let timeOutHideTyping;
socket.on("SERVER_SEND_ATT_TYPE_MESSAGE", (att) => {
    if (att == "show") typing.classList.remove("d-none");
    clearTimeout(timeOutHideTyping);
    timeOutHideTyping = setTimeout(() => {
        typing.classList.add("d-none");
    }, 3000);
    bodyChat.scrollTop = bodyChat.scrollHeight;
})